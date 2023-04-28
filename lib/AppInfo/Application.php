<?php

/**
 * @copyright Copyright (c) 2020, Felix Nüsse
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

declare(strict_types=1);

namespace OCA\Quickaccesssorting\AppInfo;


use OCP\AppFramework\App;
use OCP\EventDispatcher\IEventDispatcher;

class Application extends App {

    public function __construct() {
        parent::__construct('quickaccesssorting');

        $dispatcher = $this->getContainer()->query(IEventDispatcher::class);
        $dispatcher->addListener('OCA\Files::loadAdditionalScripts', function() {
                script('quickaccesssorting', 'quickaccesssorting-main');
                style('quickaccesssorting', 'style');
        });
    }

}