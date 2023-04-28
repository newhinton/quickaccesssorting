/**
 * @copyright Copyright (c) 2023, Felix Nüsse
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




import Vue from 'vue'
import Settings from './Settings.vue'
import {getCompareValue, QuickSort, reverseList} from "./Quicksort";
import {instantiateSortable, setHandle, setOrder} from "./SortableUtils";
import {getList} from "./DomUtils";


// Setup of settings

Vue.mixin({ methods: { t, n } })

const FileSettings = new Vue({
    render: h => h(Settings, {}),
})
const element = FileSettings.$mount().$el

OCA.Files.Settings.register(new OCA.Files.Settings.Setting('quickaccesssorting', {
    el: () => { return element },
}))

// Setup of Sidebar



window.addEventListener('DOMContentLoaded', function() {


});


$.get(OC.generateUrl("/apps/quickaccesssorting/api/v1/get/SortingStrategy"), function (data, status) {

    const list = getList().getElementsByTagName('li')
    var sort = true;
    var reverse = false;

    console.log(data)


    if (data === 'datemodified') {
        sort = false;
        reverse = true;

        $.get(OC.generateUrl("/apps/quickaccesssorting/api/v1/get/FavoriteFolders/"), function (data, status) {
            for (let i = 0; i < data.favoriteFolders.length; i++) {
                for (let j = 0; j < list.length; j++) {
                    if (getCompareValue(list, j, 'alphabet').toLowerCase() === data.favoriteFolders[i].name.toLowerCase()) {
                        list[j].setAttribute("mtime", data.favoriteFolders[i].mtime);
                    }
                }
            }
            QuickSort(list, 0, list.length - 1);
            reverseList(list);
        });

    } else if (data === 'alphabet') {
        QuickSort(list, 0, list.length - 1, 'alphabet');
        sort = false;
    } else if (data === 'date') {
        sort = true;
    } else if (data === 'customorder') {
        instantiateSortable(getList())
        let newList = []
        $.get(OC.generateUrl("/apps/quickaccesssorting/api/v1/get/CustomSortingOrder"), function (data, status) {
            let ordering;
            try {
                ordering = JSON.parse(data);
            } catch(e) {
                sort = false;
                return;
            }
            for (let j = 0; j < list.length; j++) {
                list[j].setAttribute("folderPosition", "999999");
            }
            for (let i = 0; i < ordering.length; i++) {
                for (let j = 0; j < list.length; j++) {
                    if (getCompareValue(list, j, "alphabet") === ordering[i].name.toLowerCase().trim()) {
                        list[j].setAttribute("folderPosition", ordering[i].id);
                        console.log(list[j].getAttribute("folderPosition"))
                    }
                }
            }
            QuickSort(list, 0, list.length - 1);
        });
    }

    if (sort) {
        QuickSort(list, 0, list.length - 1);
    }
    if (reverse) {
        reverseList(list);
    }
});