import { useNavigate, useLocation } from 'react-router-dom';
import { getPreviousPage, getNextPage } from '../utils/pageNavigation';

function NavigationArrows() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const previousPage = getPreviousPage(currentPath);
  const nextPage = getNextPage(currentPath);

  // Debug logging
  console.log('NavigationArrows Debug:');
  console.log('Current path:', currentPath);
  console.log('Previous page:', previousPage);
  console.log('Next page:', nextPage);

  const handleLeftClick = (e) => {
    console.log('Left click detected');
    // Check if clicking on interactive elements
    const target = e.target;
    const isInteractiveElement = target.closest('button') || 
                                target.closest('input') || 
                                target.closest('select') || 
                                target.closest('textarea') ||
                                target.closest('video') ||
                                target.closest('audio') ||
                                target.closest('a') ||
                                target.closest('[role="button"]') ||
                                target.closest('.menu-sidebar') ||
                                target.closest('[title*="màn hình"]') ||
                                target.closest('[title*="fullscreen"]');

    console.log('Is interactive element:', isInteractiveElement);
    console.log('Previous page available:', previousPage);

    if (!isInteractiveElement && previousPage) {
      console.log('Navigating to previous page:', previousPage);
      navigate(previousPage);
    }
  };

  const handleRightClick = (e) => {
    console.log('Right click detected');
    // Check if clicking on interactive elements
    const target = e.target;
    const isInteractiveElement = target.closest('button') || 
                                target.closest('input') || 
                                target.closest('select') || 
                                target.closest('textarea') ||
                                target.closest('video') ||
                                target.closest('audio') ||
                                target.closest('a') ||
                                target.closest('[role="button"]') ||
                                target.closest('.menu-sidebar') ||
                                target.closest('[title*="màn hình"]') ||
                                target.closest('[title*="fullscreen"]');

    console.log('Is interactive element:', isInteractiveElement);
    console.log('Next page available:', nextPage);

    if (!isInteractiveElement && nextPage) {
      console.log('Navigating to next page:', nextPage);
      navigate(nextPage);
    }
  };

  return (
    <>
      {/* Left Click Area - Previous Page */}
      {previousPage && (
        <div
          onClick={handleLeftClick}
          className="fixed left-0 top-0 bottom-0 w-1/7 z-10 cursor-pointer hover:bg-black hover:bg-opacity-5 transition-all"
          aria-label="Previous page"
        />
      )}

      {/* Right Click Area - Next Page */}
      {nextPage && (
        <div
          onClick={handleRightClick}
          className="fixed right-0 top-0 bottom-0 w-1/7 z-10 cursor-pointer hover:bg-black hover:bg-opacity-5 transition-all"
          aria-label="Next page"
        />
      )}
    </>
  );
}

export default NavigationArrows;

