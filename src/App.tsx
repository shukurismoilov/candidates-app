import { FC, useState } from 'react';
import { CreateRecordForm } from './components/modal/CreateRecordForm';
import { DataTable } from './components/table/DataTable';

const App: FC = () => {

  const [openForm, setOpenForm] = useState(false);

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };
  return (
    <div className="app-container">
      <button className="add-button" onClick={handleOpenForm}>
        Add New Record
      </button>
      <DataTable />
      <CreateRecordForm open={openForm} onClose={handleCloseForm} />
    </div>
  );
}

export { App };
