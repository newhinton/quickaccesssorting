<!--
 - @copyright Copyright (c) 2023, Felix Nüsse
 -
 - @author Felix Nüsse <felix.nuesse@t-online.de>
 -
 - @license AGPL-3.0
 -
 - This code is free software: you can redistribute it and/or modify
 - it under the terms of the GNU Affero General Public License, version 3,
 - as published by the Free Software Foundation.
 -
 - This program is distributed in the hope that it will be useful,
 - but WITHOUT ANY WARRANTY; without even the implied warranty of
 - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 - GNU Affero General Public License for more details.
 -
 - You should have received a copy of the GNU Affero General Public License, version 3,
 - along with this program.  If not, see <http://www.gnu.org/licenses/>
 -
 -->

<template>
	<div id="settings-quickaccesssorting">
		<label for="settings-quickaccesssorting-select">Quickaccess Sorting</label>
		<br>
		<NcSelect id="settings-quickaccesssorting-select"
							v-bind="props"
							v-model="props.value"
							:value="props.default"
							@input="updateStrategy(props.value)"
		/>
	</div>
</template>

<script>

import NcSelect from '@nextcloud/vue/dist/Components/NcSelect'

export default {
	name: 'Settings',
	components: {
		NcSelect,
	},
	mounted: function(){
		this.loadStrategy();
	},
	data() {
		return {
			props: {
				inputId: "settings-quickaccesssorting-select",
				userSelect: true,
				options: [
					{
						id: 'customorder',
						displayName: 'Custom Order',
						subtitle: 'Default, you can rearrange the order.'
					},
					{
						id: 'datemodified',
						displayName: 'Date Modified',
						subtitle: 'Ordered by the last time the folders were changed.'
					},
					{
						id: 'date',
						displayName: 'Date Added',
						subtitle: 'Ordered by the time the folders were added.'
					},
					{
						id: 'alphabet',
						displayName: 'Alphabetical',
						subtitle: 'From A to Z,'
					},
				],
			},
		}
	},
	methods: {
		loadStrategy() {
			$.get(OC.generateUrl("/apps/quickaccesssorting/api/v1/get/SortingStrategy"), (data, status) => {

				for (const option in this.props.options) {
					console.log(this.props.options[option])
					if(this.props.options[option].id === data) {
						this.props.value = this.props.options[option];
					}
				}

			});
		},
		updateStrategy(val) {
			$.get(OC.generateUrl("/apps/quickaccesssorting/api/v1/set/SortingStrategy"), {strategy: val.id}, function (data, status) {});
		},
	},
}
</script>
