import { useNavigate, useLocation } from 'react-router-dom';
import { getPreviousPage, getNextPage } from '../utils/pageNavigation';

function NavigationArrows() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const previousPage = getPreviousPage(currentPath);
  const nextPage = getNextPage(currentPath);

  const handleLeftClick = (e) => {
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
                                target.closest('.menu-sidebar');

    if (!isInteractiveElement && previousPage) {
      navigate(previousPage);
    }
  };

  const handleRightClick = (e) => {
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
                                target.closest('.menu-sidebar');

    if (!isInteractiveElement && nextPage) {
      navigate(nextPage);
    }
  };

  return (
    <>
      {/* Left Click Area - Previous Page */}
      {previousPage && (
        <div
          onClick={handleLeftClick}
          className="fixed left-0 top-0 bottom-0 w-1/6 z-10 cursor-pointer hover:bg-black hover:bg-opacity-5 transition-all"
          aria-label="Previous page"
        />
      )}

      {/* Right Click Area - Next Page */}
      {nextPage && (
        <div
          onClick={handleRightClick}
          className="fixed right-0 top-0 bottom-0 w-1/6 z-10 cursor-pointer hover:bg-black hover:bg-opacity-5 transition-all"
          aria-label="Next page"
        />
      )}
    </>
  );
}

export default NavigationArrows;

