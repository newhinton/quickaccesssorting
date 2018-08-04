<?php
/**
 * @copyright Copyright (c) 2016, ownCloud, Inc.
 *
 * @author Bjoern Schiessle <bjoern@schiessle.org>
 * @author Christoph Wurst <christoph@owncloud.com>
 * @author Joas Schilling <coding@schilljs.com>
 * @author Lukas Reschke <lukas@statuscode.ch>
 * @author Morris Jobke <hey@morrisjobke.de>
 * @author Robin Appelman <robin@icewind.nl>
 * @author Roeland Jago Douma <roeland@famdouma.nl>
 * @author Tobias Kaminsky <tobias@kaminsky.me>
 * @author Vincent Petry <pvince81@owncloud.com>
 * @author Felix Nüsse <felix.nuesse@t-online.de>
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



namespace OCA\Quickaccesssorting\Controller;

use OCP\AppFramework\Controller;

use OCP\IConfig;
use OCP\IRequest;
use OCP\IUserSession;
use OCP\Files\Folder;
use OCP\AppFramework\Http\Response;
use OC_Util;


/**
 * Class ApiController
 *
 * @package OCA\Quickaccesssorting\Controller
 */
class ApiController extends Controller
{


    private $sessionid;
    private $config;
    private $userFolder;
    protected $appName='quickaccesssorting';

    /**
     * @param string $appName
     * @param IRequest $request
     * @param IUserSession $userSession
     * @param IConfig $config
     * @param Folder $userFolder
     */
    public function __construct($appName, IRequest $request, IUserSession $userSession, IConfig $config, Folder $userFolder)
    {
        parent::__construct($appName, $request);

        $this->config = $config;
        $this->userFolder = $userFolder;
        $this->sessionid = $userSession->getUser()->getUID();

    }


    /**
     * Returns a list of favorites modifed folder.
     *
     * @NoAdminRequired
     *
     * @return DataResponse
     */
    public function getFavoritesFolder()
    {
        $nodes = $this->userFolder->searchByTag('_$!<Favorite>!$_', $this->sessionid);

        $favorites = [];
        $i = 0;
        foreach ($nodes as &$node) {

            if($node->getType() == "dir"){
            $favorites[$i]['id'] = $node->getId();
            $favorites[$i]['name'] = $node->getName();
            $favorites[$i]['path'] = $node->getInternalPath();
            $favorites[$i]['mtime'] = $node->getMTime();
            $i++;
            }
        }
        return $favorites;
        //return new DataResponse(['favoriteFolders' => $favorites]);
    }


    /**
     * quickaccess-sorting-strategy
     *
     * @NoAdminRequired
     *
     * @param string $strategy
     * @return String
     */
    public function setSortingStrategy($strategy)
    {
        $this->config->setUserValue(
            $this->sessionid,
            $this->appName,
            'quickaccess_sorting_strategy',
            (String)$strategy
        );
        return $this->getSortingStrategy();
    }

    /**
     * Get reverse-state for quickaccess-list
     *
     * @NoAdminRequired
     *
     * @return String
     */
    public function getSortingStrategy()
    {
        return $this->config->getUserValue(
            $this->sessionid,
            $this->appName,
            'quickaccess_sorting_strategy',
            'customorder');
    }

    /**
     * Set sorting-order for custom sorting
     *
     * @NoAdminRequired
     *
     * @param String $order
     * @return Response
     */
    public function setSortingOrder($order)
    {
        $this->config->setUserValue(
            $this->sessionid,
            $this->appName,
            'quickaccess_custom_sorting_order',
            (String)$order
        );

        return new Response();
    }

    /**
     * Get sorting-order for custom sorting
     *
     * @NoAdminRequired
     *
     * @return String
     */
    public function getSortingOrder()
    {
        return $this->config->getUserValue(
            $this->sessionid,
            $this->appName,
            'quickaccess_custom_sorting_order',
            "{}"
        );
    }

    /**
     * Get sorting-order for custom sorting
     *
     * @NoAdminRequired
     *
     * @param String
     * @return String
     */
    public function getNodeType($folderpath)
    {
        $node = $this->userFolder->get($folderpath);
        return $node->getType();
    }

    /**
     * Set sorting-order for custom sorting
     *
     * @NoAdminRequired
     *
     * @param String $order
     * @return Response
     */
    public function setExpandedState($state)
    {
        $this->config->setUserValue(
            $this->sessionid,
            $this->appName,
            'quickaccess_expanded_state',
            (String)$state
        );

        return new Response();
    }

    /**
     * Get sorting-order for custom sorting
     *
     * @NoAdminRequired
     *
     * @return String
     */
    public function getExpandedState()
    {
        return $this->config->getUserValue(
            $this->sessionid,
            $this->appName,
            'quickaccess_expanded_state',
            "true"
        );
    }

    public function getVersion()
    {
        return OC_Util::getHumanVersion();
    }

    public function compareVersionWithCurrent($minversion, $maxversion)
    {
        if(
            version_compare(OC_Util::getHumanVersion(), $minversion, '>=')
            &&
            version_compare(OC_Util::getHumanVersion(), $maxversion, '<')
        ){
            return true;
        }
        return false;
    }

}
