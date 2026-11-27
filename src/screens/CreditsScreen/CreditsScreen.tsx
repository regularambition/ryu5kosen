import { useState } from 'react';
import SidebarScreenLayout from '../../components/layouts/SidebarScreenLayout';
import './CreditsScreen.css';
import PagingControls from '../../components/ui/navigation/PagingControls/PagingControls';

const urlPrefix = 'https://commons.nicovideo.jp/works/nc';

const sozaiNo = [470108, 318468, 305113, 218433, 433989, 302093];
const totalPages = Math.ceil(sozaiNo.length / 3);

function CreditsScreen() {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const currentPage = currentPageIndex + 1;

  const goToPreviousPage = () => {
    setCurrentPageIndex((pageIndex) => Math.max(0, pageIndex - 1));
  };

  const goToNextPage = () => {
    setCurrentPageIndex((pageIndex) => Math.min(totalPages - 1, pageIndex + 1));
  };

  const start = currentPageIndex * 3;
  const end = Math.min(start + 3, sozaiNo.length);
  const items = [];

  for (let i = start; i < end; i++) {
    const no = sozaiNo[i];
    items.push(
      <li key={no}>
        {urlPrefix}
        {no}
      </li>,
    );
  }

  return (
    <SidebarScreenLayout>
      <ul className="credits-page">{items}</ul>

      <PagingControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPreviousPage={goToPreviousPage}
        onNextPage={goToNextPage}
      />
    </SidebarScreenLayout>
  );
}

export default CreditsScreen;
