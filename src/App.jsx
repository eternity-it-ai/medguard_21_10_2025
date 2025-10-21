// App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import ProcedureCheck from './pages/ProcedureCheck';
import AuditReview from './pages/AuditReview';
import ComplianceManagement from './pages/ComplianceManagement';
import Reports from './pages/Reports';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/app/ProcedureCheck" replace />} />
            <Route path="/app" element={<Layout />}>
                <Route index element={<ProcedureCheck />} />
                <Route path="ProcedureCheck" element={<ProcedureCheck />} />
                <Route path="AuditReview" element={<AuditReview />} />
                <Route path="ComplianceManagement" element={<ComplianceManagement />} />
                <Route path="Reports" element={<Reports />} />
            </Route>
        </Routes>
    );
}