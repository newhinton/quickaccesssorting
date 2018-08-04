<?php
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

return [
    'routes' => [
        [
            'name' => 'Api#setSortingStrategy',
            'url' => '/api/v1/set/SortingStrategy',
            'verb' => 'GET',
        ],
        [
            'name' => 'Api#getSortingStrategy',
            'url' => '/api/v1/get/SortingStrategy',
            'verb' => 'GET',
        ],
        [
            'name' => 'Api#getFavoritesFolder',
            'url' => '/api/v1/get/FavoriteFolders/',
            'verb' => 'GET'
        ],
        [
            'name' => 'Api#setSortingOrder',
            'url' => '/api/v1/set/CustomSortingOrder',
            'verb' => 'GET',
        ],
        [
            'name' => 'Api#getSortingOrder',
            'url' => '/api/v1/get/CustomSortingOrder',
            'verb' => 'GET',
        ],
        [
            'name' => 'Api#getExpandedState',
            'url' => '/api/v1/get/ExpandedState',
            'verb' => 'GET',
        ],
        [
            'name' => 'Api#setExpandedState',
            'url' => '/api/v1/set/ExpandedState',
            'verb' => 'GET',
        ],
        [
            'name' => 'Api#getVersion',
            'url' => '/api/v1/get/version',
            'verb' => 'GET',
        ],
        [
            'name' => 'Api#compareVersionWithCurrent',
            'url' => '/api/v1/get/compareversion',
            'verb' => 'GET',
        ],
    ]
];