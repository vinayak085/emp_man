import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import EmployeeTable from './components/EmployeeTable';
import EmployeeModal from './components/EmployeeModal';
import ViewEmployeeModal from './components/ViewEmployeeModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Pagination from './components/Pagination';
import Toast from './components/Toast';
import { useDebounce } from './hooks/useDebounce';
import { employeeApi, formatApiError } from './services/api';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  // Main Data States
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [networkError, setNetworkError] = useState(null);
  const [dbStatus, setDbStatus] = useState('checking');

  // Search, Sort, and Pagination States
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalEmployee, setModalEmployee] = useState(null); // null = Add, object = Edit
  const [viewingEmployee, setViewingEmployee] = useState(null);
  const [deletingEmployee, setDeletingEmployee] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalServerError, setModalServerError] = useState(null);

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  const addToast = (type, title, message) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Reset page to 1 whenever search query changes
  const prevSearchRef = useRef(debouncedSearch);
  useEffect(() => {
    if (prevSearchRef.current !== debouncedSearch) {
      setCurrentPage(1);
      prevSearchRef.current = debouncedSearch;
    }
  }, [debouncedSearch]);

  // Fetch employees list
  const fetchEmployees = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    setNetworkError(null);

    try {
      const response = await employeeApi.getAll({
        page: currentPage,
        limit: pageSize,
        search: debouncedSearch,
        sortBy,
        order,
      });

      if (response.success) {
        setEmployees(response.data || []);
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages || 1);
          setTotalRecords(response.pagination.totalRecords || 0);
        }
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
      const msg = formatApiError(err);
      setNetworkError(msg);
      addToast('error', 'Failed to load employees', msg);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [currentPage, pageSize, debouncedSearch, sortBy, order]);

  // Fetch stats and health status
  const fetchStatsAndHealth = useCallback(async () => {
    try {
      const [statsRes, healthRes] = await Promise.allSettled([
        employeeApi.getStats(),
        employeeApi.health(),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value?.success) {
        setStats(statsRes.value.data);
      }

      if (healthRes.status === 'fulfilled' && healthRes.value?.database) {
        setDbStatus(healthRes.value.database);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  // Initial load and dependency-driven fetch
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    fetchStatsAndHealth();
  }, [fetchStatsAndHealth]);

  // Manual refresh handler
  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchEmployees(true);
    fetchStatsAndHealth();
  };

  // Sort change handler
  const handleSortChange = (newSortBy, newOrder) => {
    setSortBy(newSortBy);
    setOrder(newOrder);
    setCurrentPage(1);
  };

  // Page size change handler
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  // Open modal for Create
  const handleOpenAddModal = () => {
    setModalEmployee(null);
    setModalServerError(null);
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = (emp) => {
    setModalEmployee(emp);
    setModalServerError(null);
    setIsModalOpen(true);
  };

  // Submit Create or Update
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    setModalServerError(null);

    try {
      if (modalEmployee) {
        // Update
        const empId = modalEmployee._id || modalEmployee.id;
        const res = await employeeApi.update(empId, formData);
        if (res.success) {
          addToast('success', 'Employee Updated', `${formData.name} was updated successfully.`);
          setIsModalOpen(false);
          fetchEmployees(true);
          fetchStatsAndHealth();
        }
      } else {
        // Create
        const res = await employeeApi.create(formData);
        if (res.success) {
          addToast('success', 'Employee Created', `${formData.name} has been added to the system.`);
          setIsModalOpen(false);
          // If sorting by newest, go to page 1
          if (currentPage !== 1) setCurrentPage(1);
          else fetchEmployees(true);
          fetchStatsAndHealth();
        }
      }
    } catch (err) {
      console.error('Form submit error:', err);
      const msg = formatApiError(err);
      setModalServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm and Execute Delete
  const handleConfirmDelete = async () => {
    if (!deletingEmployee) return;

    setIsDeleting(true);
    const empId = deletingEmployee._id || deletingEmployee.id;
    const empName = deletingEmployee.name;

    try {
      const res = await employeeApi.delete(empId);
      if (res.success) {
        addToast('success', 'Employee Deleted', `${empName} was deleted successfully.`);
        setDeletingEmployee(null);

        // If this was the last item on the page and we're past page 1, step back
        if (employees.length === 1 && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        } else {
          fetchEmployees(true);
        }
        fetchStatsAndHealth();
      }
    } catch (err) {
      console.error('Delete error:', err);
      const msg = formatApiError(err);
      addToast('error', 'Delete Failed', msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        dbStatus={dbStatus}
        onRefresh={handleManualRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Network Error Alert Banner */}
        {networkError && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-rose-800 text-sm shadow-sm">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <strong className="font-semibold">Backend Connection Alert:</strong>{' '}
                <span>{networkError}</span>
              </div>
            </div>
            <button
              onClick={handleManualRefresh}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-100 hover:bg-rose-200 rounded-xl transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Connection
            </button>
          </div>
        )}

        {/* Dashboard Stat Cards */}
        <StatsCards
          stats={stats}
          totalRecords={totalRecords}
          isLoading={isLoading && !isRefreshing}
        />

        {/* Employee Table & Controls */}
        <EmployeeTable
          employees={employees}
          isLoading={isLoading}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearSearch={() => setSearchQuery('')}
          sortBy={sortBy}
          order={order}
          onSortChange={handleSortChange}
          onAddClick={handleOpenAddModal}
          onViewClick={setViewingEmployee}
          onEditClick={handleOpenEditModal}
          onDeleteClick={setDeletingEmployee}
          currentPage={currentPage}
          pageSize={pageSize}
        />

        {/* Server-Side Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={handlePageSizeChange}
          isLoading={isLoading}
        />
      </main>

      {/* Add / Edit Employee Modal */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        employee={modalEmployee}
        isSubmitting={isSubmitting}
        serverError={modalServerError}
      />

      {/* View Employee Details Modal */}
      <ViewEmployeeModal
        isOpen={Boolean(viewingEmployee)}
        onClose={() => setViewingEmployee(null)}
        employee={viewingEmployee}
        onEdit={(emp) => handleOpenEditModal(emp)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingEmployee)}
        onClose={() => setDeletingEmployee(null)}
        onConfirm={handleConfirmDelete}
        employee={deletingEmployee}
        isDeleting={isDeleting}
      />

      {/* Floating Toast Alerts */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
