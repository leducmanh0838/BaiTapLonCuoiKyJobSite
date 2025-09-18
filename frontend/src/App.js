import { ToastContainer } from 'react-toastify';
import './App.css';
import { AppProvider } from './configs/AppProvider';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import JobPostingList from './components/JobPostings/JobPostingList';
import Header from './components/layout/Header';
import Sample1 from './components/Samples/Sample1';
import Sample3 from './components/Samples/Sample3';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import CvManager from './components/Cv/CvManager';

import JobPostingsManagement from './components/JobPostings/JobPostingsManagement';
import Sample2 from './components/Samples/Sample2';
import JobPostingForm from './components/JobPostings/JobPostingForm';
import JobPostingForm2 from './components/JobPostings/JobPostingForm';
import CvForm from './components/Cv/CvForm';
import ApplicationList from './components/JobPostings/ApplicationList';
import ApplicationManagement from './components/Application/ApplicationManagement';
import JobPostingDetail from './components/JobPostings/JobPostingDetail';
import JobApplicationForm from './components/JobPostings/JobApplicationForm';
const App = () => {

  return (
    <AppProvider>
      <BrowserRouter>
        <div className="d-flex" >
          {/* Sidebar */}
          <ToastContainer
            position="top-center"
            autoClose={10000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />

          {/* Main Content */}
          <div className="flex-grow-1 ms-0 ms-md-1" style={{ marginLeft: '0px' }}>
            {/* Header */}
            <Header />
            <Routes>
              <Route path="/" element={<JobPostingList />} />
              <Route path="/cvs" element={<CvManager />} />
              <Route path="/cvs/new" element={<CvForm />} />
              <Route path="/cvs/:cvId/edit" element={<CvForm />} />
              <Route path="/sample1" element={<Sample1 />} />
              <Route path="/sample2/new" element={<Sample2 />} />
              <Route path="/sample2/:itemId/edit" element={<Sample2 />} />
              {/* <Route path="/sample3" element={<Sample3 />} /> */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/employer/job-postings/" element={<JobPostingsManagement />} />
              <Route path="/employer/job-postings/new" element={<JobPostingForm />} />
              <Route path="/employer/job-postings/:itemId/edit" element={<JobPostingForm />} />
              <Route path="/employer/job-postings/:id/applications" element={<ApplicationList />}/>
              <Route path="/applications" element={<ApplicationManagement />} />
              <Route path="/job-postings/:id" element={<JobPostingDetail />} />
              <Route path="/job-postings/:id/applications/" element={<JobApplicationForm />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AppProvider>

  );
}

export default App;