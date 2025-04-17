import { useState } from "react";

interface KYCRequest {
  id: string;
  userId: string;
  userName: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  details: {
    fullName: string;
    dateOfBirth: string;
    address: string;
    phoneNumber: string;
    idType: string;
    idNumber: string;
    idImage: string;
    selfieImage: string;
  };
}

// Mock data - replace with API call
const mockKYCRequests: KYCRequest[] = [
  {
    id: "1",
    userId: "user1",
    userName: "John Doe",
    email: "john@example.com",
    status: "pending",
    submittedAt: "2024-03-15T10:30:00",
    details: {
      fullName: "John Doe",
      dateOfBirth: "1990-05-15",
      address: "123 Main St, City, Country",
      phoneNumber: "+1234567890",
      idType: "Passport",
      idNumber: "AB123456",
      idImage: "https://example.com/id-image.jpg",
      selfieImage: "https://example.com/selfie.jpg",
    },
  },
  {
    id: "2",
    userId: "user2",
    userName: "Jane Smith",
    email: "jane@example.com",
    status: "pending",
    submittedAt: "2024-03-14T15:45:00",
    details: {
      fullName: "Jane Smith",
      dateOfBirth: "1988-11-23",
      address: "456 Oak Ave, Town, Country",
      phoneNumber: "+1987654321",
      idType: "Driver License",
      idNumber: "DL789012",
      idImage: "https://example.com/id-image2.jpg",
      selfieImage: "https://example.com/selfie2.jpg",
    },
  },
  // Add more mock data as needed
];

export function KYCRequestsTable() {
  const [selectedRequest, setSelectedRequest] = useState<KYCRequest | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (request: KYCRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleApprove = () => {
    // Mock API call - replace with actual API call
    console.log("Approving KYC request:", selectedRequest?.id);
    setIsModalOpen(false);
  };

  const handleReject = () => {
    // Mock API call - replace with actual API call
    console.log("Rejecting KYC request:", selectedRequest?.id);
    setIsModalOpen(false);
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title mb-4">Recent KYC Requests</h2>

        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Submitted</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockKYCRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.userName}</td>
                  <td>{request.email}</td>
                  <td>{new Date(request.submittedAt).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`badge ${
                        request.status === "pending"
                          ? "badge-warning"
                          : request.status === "approved"
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleViewDetails(request)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {isModalOpen && selectedRequest && (
          <div className="modal modal-open">
            <div className="modal-box max-w-3xl">
              <h3 className="font-bold text-lg mb-4">KYC Request Details</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Full Name:</p>
                  <p>{selectedRequest.details.fullName}</p>
                </div>
                <div>
                  <p className="font-semibold">Date of Birth:</p>
                  <p>{selectedRequest.details.dateOfBirth}</p>
                </div>
                <div>
                  <p className="font-semibold">Address:</p>
                  <p>{selectedRequest.details.address}</p>
                </div>
                <div>
                  <p className="font-semibold">Phone Number:</p>
                  <p>{selectedRequest.details.phoneNumber}</p>
                </div>
                <div>
                  <p className="font-semibold">ID Type:</p>
                  <p>{selectedRequest.details.idType}</p>
                </div>
                <div>
                  <p className="font-semibold">ID Number:</p>
                  <p>{selectedRequest.details.idNumber}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="font-semibold mb-2">ID Image:</p>
                <img
                  src={selectedRequest.details.idImage}
                  alt="ID"
                  className="max-w-xs rounded-lg"
                />
              </div>

              <div className="mt-4">
                <p className="font-semibold mb-2">Selfie:</p>
                <img
                  src={selectedRequest.details.selfieImage}
                  alt="Selfie"
                  className="max-w-xs rounded-lg"
                />
              </div>

              <div className="modal-action">
                <button className="btn btn-error" onClick={handleReject}>
                  Reject
                </button>
                <button className="btn btn-success" onClick={handleApprove}>
                  Approve
                </button>
                <button className="btn" onClick={() => setIsModalOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
