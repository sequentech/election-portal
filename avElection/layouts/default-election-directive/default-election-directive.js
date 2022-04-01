/**
 * This file is part of election-portal.
 * Copyright (C) 2015-2016  Sequent Tech Inc <legal@sequentech.io>

 * election-portal is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License.

 * election-portal  is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.

 * You should have received a copy of the GNU Affero General Public License
 * along with election-portal.  If not, see <http://www.gnu.org/licenses/>.
**/

/**
 * Public lading page for an election
 */
angular
  .module('avElection')
  .directive(
    'aveDefaultElection', 
    function (
      $state, 
      $stateParams,
      ConfigService,
      ShowVersionsModalService
    ) {
    function link(scope, _element, _attrs) 
    {
      scope.organization = ConfigService.organization;

      function generateButtonsInfo() 
      {
        scope.buttonsInfo = [];

        scope.$watch(
          "election",
          function() {
            if (scope.election) 
            {
              var data = scope.election.presentation.share_text;
              for (var i = 0, length = data.length; i < length; i++)
              {
                var p = data[i];
                var buttonInfo = {
                  link: '',
                  img: '',
                  button_text: p.button_text,
                  class: 'btn btn-primary',
                  network: p.network
                };
                var message = p.social_message;
                message = message.replace(
                  '__URL__',
                  window.location.protocol + '//' + window.location.host + '/election/' + scope.election.id + '/public/home'
                );

                if ('Facebook' === p.network) 
                {
                  buttonInfo.link = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(message);
                  buttonInfo.img = '/election/img/facebook_logo_50.png';
                  buttonInfo.class = buttonInfo.class + ' btn-facebook';
                }
                else if('Twitter' === p.network) 
                {
                  buttonInfo.link = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(message) + '&source=webclient';
                  buttonInfo.img = '/election/img/twitter_logo_48.png';
                  buttonInfo.class = buttonInfo.class + ' btn-twitter';
                }

                scope.buttonsInfo.push(buttonInfo);
              }
            }
        });
      }

      generateButtonsInfo();

      scope.name = function () 
      {
        return $state.current.name.replace("election.public.show.", "");
      };

      scope.pageName = function()
      {
        return $stateParams.name;
      };

      scope.checkState = function (validStates)
      {
        return _.contains(validStates, scope.electionState);
      };
      scope.showVersionsModal = ShowVersionsModalService;
      scope.configService = ConfigService;
    }
    return {
      restrict: 'AE',
      scope: true,
      link: link,
      templateUrl: 'avElection/layouts/default-election-directive/default-election-directive.html'
    };
  });
