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
		<NcSelect id="settings-quickaccesssorting-select" v-bind="props" v-model="props.value" value="0-john"/>
	</div>
</template>

<script>

import { generateUrl } from '@nextcloud/router'
import axios from '@nextcloud/axios'
import NcSelect from '@nextcloud/vue/dist/Components/NcSelect'


export default {
	name: 'Settings',
	components: {
		NcSelect,
	},
	data() {
		return {
			props: {
				inputId: "001",
				userSelect: true,
				options: [
					{
						id: '0-john',
						displayName: 'Custom Sorting',
						subtitle: 'Default, you can rearrange the order.'
					},
				],
			},
		}
	},
	methods: {},
}
</script>