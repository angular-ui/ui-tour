/*global angular */
/**
 * uiTour directive
 *
 * @example:
 *   <ul ui-tour="currentStep">
 *     <li target="#someId">
 *       First Tooltip
 *       <a ng-click="currentStep=currentStep+1">Next</a>
 *     </li>
 *     <li target=".items:eq(2)" key="two">
 *       Second Tooltip
 *       <a ng-click="currentStep=currentStep-1">Prev</a>
 *     </li>
 *     <li target=".items:eq(2)">
 *       Third Tooltip
 *       <a ng-click="currentStep='two'">Go directly to 'two'</a>
 *       <a ng-click="currentStep=0">Done</a>
 *     </li>
 *   </ul>
 */
angular.module('ui.tour', [])

.directive('uiTour', ['$timeout', '$parse', function($timeout, $parse){
  return {
    link: function($scope, $element, $attributes) {
      var steps = [],
          model = $parse($attributes.joyride);

      // Cache steps
      $scope.$watch($attributes.uiRefresh, function(){
        $element.children().each(function(i, item){
          var $element = angular.element(item);
          var step = {
            element: $element,
            index: i,
            key: $element.attr('key'),
            target:$element.attr('target')
          };
          steps.push(step);
        });
      });

      // Watch model and change steps
      $scope.$watch($attributes.joyride, function(newVal, oldVal){
        if (angular.isNumber(newVal)) {
          showStep(newVal)
        } else {
          if (newVal === true)
            model.assign($scope, 1);
          if (angular.isString(newVal)) {
            var stepNumber = 0;
            angular.each(steps, function(step, index) {
              if (step.key === newVal)
                stepNumber = index+1;
            });
            model.assign($scope, stepNumber);
          }
        }
        if (newVal === true) {
          showStep(steps[0]);
        } else if (angular.isNumber(newVal)) {
          showStep(steps[newVal-1]);
        } else if (angular.isString(newVal)) {
            debugger;
          step = _.find(steps, function(step){
            return step.key === newVal;
          })
          if (step)
            showStep(steps.indexOf(step));
        }
      });

      // Show step
      function showStep(stepNumber) {
        $element.children().removeClass('active');
        if (steps[stepNumber-1]) {
          $timeout(function(){
            offset = angular.element(steps[stepNumber-1].target).offset();
            steps[stepNumber-1].element.addClass('active').css(offset);
          });
        }
      }
    }
  };
}]);