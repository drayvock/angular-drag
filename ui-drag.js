angular.module('ui-drag', [], function(){})
.directive('draggable', function($timeout){
  // Event binding helper
  function bindEvent(element, event, handler){
    return {element: element, event: element.bind(event, handler)};
  }  
  return{
    restrict: 'A',
    scope: {
      dragHorizontal: '=?',
      dragVertical: '=?',
      dragRestrict: '=?'
    },
    link: function(scope, element, attrs){
      // Initialize 
      scope.isDragging = false;
      scope.dragHorizontal = angular.isUndefined(scope.dragHorizontal) || scope.dragHorizontal;
      scope.dragVertical = angular.isUndefined(scope.dragVertical) || scope.dragVertical;
      if(angular.isUndefined(scope.dragRestrict)){
         scope.dragRestrict = element.parent()[0];
      }
      
      // Bind all the events and push them to an array to be unbound on $destroy.
      var events = []; 
      var timeouts = [];
      var win = angular.element(window);
      events.push(bindEvent(win, 'mouseup', mouseUp));
      events.push(bindEvent(win, 'mousemove', mouseMove));
      events.push(bindEvent(element, 'mouseup', mouseUp));
      events.push(bindEvent(element, 'mousedown', mouseDown));
      
      scope.$on('$destroy', function(){
        angular.forEach(events, function(ev){
          ev.element.unbind(ev.event);
        });
        
        // seems unnecessary, but just in case...
        angular.forEach(timeouts, function(timeout){
          $timeout.cancel(timeout);
        });
      });
      
      function mouseDown(e){
        e.stopPropagation();
        // $timeout is used so that the digest cycle picks up the change.
        var timeout = $timeout(function(){
          scope.isDragging = true;
          timeouts.splice(timeouts.indexOf(timeout), 1);
        }, 0);
        timeouts.push(timeout);
      }
      function mouseUp(e){
        e.stopPropagation();
        // $timeout is used so that the digest cycle picks up the change.
        var timeout = $timeout(function(){
          scope.isDragging = false;
          timeouts.splice(timeouts.indexOf(timeout), 1);
        }, 0);
        timeouts.push(timeout);
      }
      function mouseMove(e){
        if(!scope.isDragging) return;      
        e.stopPropagation();
        
        element.css("position", "absolute");
        
        var container = angular.element(scope.dragRestrict)[0];
        if(scope.dragHorizontal){
          // Is the mouse's X within the parent's X
          var leftBound = container.offsetLeft || 0;
          var rightBound = container.offsetLeft + container.scrollWidth - element[0].scrollWidth || window.innerWidth;        
            // If so, set the elements left to the mouse's x.
          if(e.pageX >= leftBound && e.pageX <= rightBound){
            element.css("left", e.pageX + "px");          
          } else if (e.pageX < leftBound) {
            element.css("left", leftBound + "px");
          } else if (e.pageX > rightBound) {
            element.css("left", rightBound + "px");
          }
        }
        
        if(scope.dragVertical){
          // Is the mouse's Y within the parent's Y
          var upperBound = container.offsetTop || 0;
          var lowerBound = container.offsetTop + container.scrollHeight - element[0].scrollHeight || window.innerHeight;        
          // If so, set the elements top to the mouse's y.
          if(e.pageY >= upperBound && e.pageY <= lowerBound){
            element.css("top", e.pageY + "px");
          } else if (e.pageY < upperBound) {
            element.css("top", upperBound + "px");
          } else if (e.pageY > lowerBound) {
            element.css("top", lowerBound + "px");
          }
        }
      }
    }
  }
});