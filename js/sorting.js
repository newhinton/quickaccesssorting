/**
 * @copyright Copyright (c) 2018, Felix Nüsse
 *
 * @author Felix Nüsse <felix.nuesse@t-online.de>
 *
 * @license AGPL-3.0
 *
 * This code is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License, version 3,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License, version 3,
 * along with this program.  If not, see <http://www.gnu.org/licenses/>
 *
 */

(function () {

    $(document).ready(function () {
        new NavigationExtender($(document));
    });


    /**
     * @class OCA.Files.Navigation
     * @classdesc Navigation control for the files app sidebar.
     *
     * @param $el element containing the navigation
     */
    var NavigationExtender = function ($el) {
        this.initialize($el);
    };


    NavigationExtender.prototype = {

        /**
         *
         */
        $appname: 'quickaccesssorting',

        /**
         * Strategy by which the quickaccesslist is sorted
         */
        $sortingStrategy: 'customorder',

        /**
         * Possible sorting strategies (first is Default)
         */
        $sortingStrategies:  [["customorder", "Custom Order"], ["datemodified", "Date Modified"], ["date", "Date Added"], ["alphabet","Alphabetical"]],

        /**
         * Key for the quick-acces-list
         */
        $quickAccessListKey: 'sublist-favorites',
        /**
         * Key for the dropdowninjection
         */
        $InjectionKey: 'files-setting-showhidden',

        $SortingSelectionKey: 'sortingstrategy',

        initialize: function ($el) {
            this._injectDropdownMenu();
            this._setOnDrag();
            this.nc13preinit();

            var scope = this;
            console.log("load sorting");
            $.get(OC.generateUrl("/apps/" + this.$appname + "/api/v1/get/SortingStrategy"), function (data, status) {
                scope.$sortingStrategy = data;
                scope.setInitialQuickaccessSettings();
            });

        },

        /**
         * Build Nextcloud 13 Favorites Access
         */
        nc13preinit: function () {
            var favelem= document.getElementsByClassName('nav-favorites')[0];
            favelem.classList.add("collapsible");
            favelem.classList.add("open");

            var ul = document.createElement("ul");                 // Create a <li> node
            ul.id=this.$quickAccessListKey;
            var scope = this;
            //node.appendChild(textnode);                              // Append the text to <li>

            favelem.appendChild(ul);     // Append <li> to <ul> with id="myList"


            $.get(OC.generateUrl("/apps/" + this.$appname + "/api/v1/get/FavoriteFolders"), function (data, status) {
                for (var index = 0; index < data.length; ++index) {
                    //console.log(data[index]);
                    var node=document.createElement("li");
                    node.setAttribute("folderposition",data[index].id);

                    var a=document.createElement("a");
                    a.setAttribute("href",OC.generateUrl("/apps/files/?dir=" + data[index].path.replace("files/", "/")));
                    a.classList.add("nav-icon-files");
                    a.classList.add("svg");
                    a.innerHTML=data[index].name;
                    node.appendChild(a);


                    /*
                    <li data-id="-Bravo" data-dir="/Bravo" data-view="files" class="nav--Bravo" folderposition="0">
                        <a href="/server/index.php/apps/files/?dir=/Bravo&amp;view=files" class="nav-icon-files svg">Bravo</a>
                    </li>
                    */

                    document.getElementById(scope.$quickAccessListKey).appendChild(node);
                }
            });

            },

        /**
         * Event handler for when dragging an item
         */
        _injectDropdownMenu: function () {

            var injectionString="<div id='files-setting-sorting' class='QuickAccessSettingsContainerPadding'>"+
                "   <label for='"+this.$SortingSelectionKey+"'>Sorting-Strategy</label><br>"+
                "   <select id='"+this.$SortingSelectionKey+"' name='sortingstrategy'>";


            injectionString+="       <option value='"+this.$sortingStrategies[0][0]+"'>"+t(this.$appname, this.$sortingStrategies[0][1]+" (Default)")+"</option>";

            console.log(this.$sortingStrategy);
            this.$sortingStrategies.forEach(function(strategy){
                injectionString+="       <option ";
                if(this.$sortingStrategy===strategy[0]){
                    injectionString+="selected";
                }
                injectionString+=" value='"+strategy[0]+"'>"+t(this.$appname, strategy[1])+"</option>";
            });

            injectionString+="   </select>";
            injectionString+="</div>";

            $("#" + this.$InjectionKey).after(injectionString);

        },
        /**
         * Event handler for when dragging an item
         */
        _setOnDrag: function () {
            var scope = this;
            var element = $("#sublist-favorites");
            $(function () {
                element.sortable({
                    axis: "y",
                    containment: "parent",
                    scroll: false,
                    zIndex: 0,
                    opacity: 0.5,
                    tolerance: "pointer",
                    //revert: 0.05,
                    //delay: 150,
                    start: function (event, ui) {
                        //Fix for offset
                        ui.helper[0].style.left = '0px';

                        //Change Icon while dragging
                        var list = document.getElementById(scope.$quickAccessListKey).getElementsByTagName('li');
                        for (var j = 0; j < list.length; j++) {
                            if (!(typeof list[j].getElementsByTagName('a')[0] === 'undefined')) {
                                list[j].getElementsByTagName('a')[0].classList.remove("nav-icon-files");
                                list[j].getElementsByTagName('a')[0].classList.add('icon-menu');
                            }
                        }
                    },
                    stop: function (event, ui) {
                        //Clean up offset
                        ui.item.removeAttr("style");

                        //Change Icon back after dragging
                        var list = document.getElementById(scope.$quickAccessListKey.toString()).getElementsByTagName('li');
                        for (var j = 0; j < list.length; j++) {
                            if (!(typeof list[j].getElementsByTagName('a')[0] === 'undefined')) {
                                list[j].getElementsByTagName('a')[0].classList.add("nav-icon-files");
                                list[j].getElementsByTagName('a')[0].classList.remove('icon-menu');
                            }
                        }
                    },
                    update: function (event, ui) {
                        var list = document.getElementById(scope.$quickAccessListKey.toString()).getElementsByTagName('li');
                        var string = [];
                        for (var j = 0; j < list.length; j++) {
                            var Object = {
                                id: j,
                                name: scope.getCompareValue(list, j, 'alphabet')
                            };
                            string.push(Object);
                        }
                        var resultorder = JSON.stringify(string);
                        $.get(OC.generateUrl("/apps/" + this.$appname + "/api/v1/set/CustomSortingOrder"), {order: resultorder}, function (data, status) {});
                    }
                });
            });
        },

        /**
         * Sort initially as setup of sidebar for QuickAccess
         */
        setInitialQuickaccessSettings: function () {

            var quickAccesKey = this.$quickAccessListKey;
            var list = document.getElementById(quickAccesKey).getElementsByTagName('li');
            var sortablelist = $("#sublist-favorites");

            var strategyDropDownMenu = document.getElementById(this.$SortingSelectionKey);
            if (strategyDropDownMenu.value !== "customorder") {
                sortablelist.sortable({disabled: true});
            }

            var scope = this;
            var sort = true;
            var reverse = false;

            strategyDropDownMenu.addEventListener("change", function () {
                scope.$sortingStrategy = strategyDropDownMenu.value;
                console.log("selected= "+scope.$sortingStrategy);
                if (strategyDropDownMenu.value === "customorder") {
                    sortablelist.sortable({disabled: false});
                } else {
                    sortablelist.sortable({disabled: true});
                }
                $.get(OC.generateUrl("/apps/" + scope.$appname + "/api/v1/set/SortingStrategy"), {strategy: scope.$sortingStrategy}, function (data, status) {
                    console.log(data);
                    console.log(status);
                    scope.QuickSort(list, 0, list.length - 1);
                });
            });

            strategyDropDownMenu.value = this.$sortingStrategy;

            if (this.$sortingStrategy === 'datemodified') {
                sort = false;
                reverse = false;

                var scope = this;
                $.get(OC.generateUrl("/apps/" + this.$appname + "/api/v1/get/FavoriteFolder/"), function (data, status) {
                    for (var i = 0; i < data.favoriteFolders.length; i++) {
                        for (var j = 0; j < list.length; j++) {
                            if (scope.getCompareValue(list, j, 'alphabet').toLowerCase() === data.favoriteFolders[i].name.toLowerCase()) {
                                list[j].setAttribute("mtime", data.favoriteFolders[i].mtime);
                            }
                        }
                    }
                    scope.QuickSort(list, 0, list.length - 1);
                    scope.reverse(list);
                });

            } else if (this.$sortingStrategy === 'alphabet') {
                sort = true;
            } else if (this.$sortingStrategy === 'date') {
                sort = true;
            } else if (this.$sortingStrategy === 'customorder') {
                var scope = this;
                $.get(OC.generateUrl("/apps/" + this.$appname + "/api/v1/get/CustomSortingOrder"), function (data, status) {
                    console.log(data);
                    var ordering = JSON.parse(data);
                    for (var i = 0; i < ordering.length; i++) {
                        for (var j = 0; j < list.length; j++) {
                            if (scope.getCompareValue(list, j, 'alphabet').toLowerCase() === ordering[i].name.toLowerCase()) {
                                list[j].setAttribute("folderPosition", ordering[i].id);
                            }
                        }
                    }
                    scope.QuickSort(list, 0, list.length - 1);
                });
                sort = false;
            }

            if (sort) {
                this.QuickSort(list, 0, list.length - 1);
            }
            if (reverse) {
                this.reverse(list);
            }

        },

        /**
         * Sorting-Algorithm for QuickAccess
         */
        QuickSort: function (list, start, end) {
            var lastMatch;
            if (list.length > 1) {
                lastMatch = this.quicksort_helper(list, start, end);
                if (start < lastMatch - 1) {
                    this.QuickSort(list, start, lastMatch - 1);
                }
                if (lastMatch < end) {
                    this.QuickSort(list, lastMatch, end);
                }
            }
        },

        /**
         * Sorting-Algorithm-Helper for QuickAccess
         */
        quicksort_helper: function (list, start, end) {
            var pivot = Math.floor((end + start) / 2);
            var pivotElement = this.getCompareValue(list, pivot);
            var i = start;
            var j = end;

            while (i <= j) {
                while (this.getCompareValue(list, i) < pivotElement) {
                    i++;
                }
                while (this.getCompareValue(list, j) > pivotElement) {
                    j--;
                }
                if (i <= j) {
                    this.swap(list, i, j);
                    i++;
                    j--;
                }
            }
            return i;
        },

        /**
         * Sorting-Algorithm-Helper for QuickAccess
         * This method allows easy access to the element which is sorted by.
         */
        getCompareValue: function (nodes, int, strategy) {

            if ((typeof strategy === 'undefined')) {
                strategy = this.$sortingStrategy;
            }

            if (strategy === 'alphabet') {
                return nodes[int].getElementsByTagName('a')[0].innerHTML.toLowerCase();
            } else if (strategy === 'date') {
                return nodes[int].getAttribute('folderPosition').toLowerCase();
            } else if (strategy === 'datemodified') {
                return nodes[int].getAttribute('mtime');
            } else if (strategy === 'customorder') {
                return nodes[int].getAttribute('folderPosition');
            }
            return nodes[int].getElementsByTagName('a')[0].innerHTML.toLowerCase();
        },

        /**
         * Sorting-Algorithm-Helper for QuickAccess
         * This method allows easy swapping of elements.
         */
        swap: function (list, j, i) {
            list[i].before(list[j]);
            list[j].before(list[i]);
        },

        /**
         * Reverse QuickAccess-List
         */
        reverse: function (list) {
            var len = list.length - 1;
            for (var i = 0; i < len / 2; i++) {
                this.swap(list, i, len - i);
            }
        }

    };

})(window, jQuery);

