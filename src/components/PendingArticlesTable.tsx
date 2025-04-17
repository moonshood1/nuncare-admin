import { useState } from "react";

interface PendingArticle {
  id: string;
  title: string;
  author: string;
  category: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  details: {
    content: string;
    summary: string;
    tags: string[];
    imageUrl: string;
    references: string[];
  };
}

// Mock data - replace with API call
const mockPendingArticles: PendingArticle[] = [
  {
    id: "1",
    title: "Understanding Diabetes Management",
    author: "Dr. Sarah Johnson",
    category: "Health Education",
    submittedAt: "2024-03-15T10:30:00",
    status: "pending",
    details: {
      content:
        "Diabetes is a chronic condition that affects how your body turns food into energy...",
      summary:
        "A comprehensive guide to managing diabetes through diet, exercise, and medication.",
      tags: ["diabetes", "health", "management", "lifestyle"],
      imageUrl: "https://example.com/diabetes-image.jpg",
      references: [
        "World Health Organization Guidelines",
        "American Diabetes Association",
        "Journal of Clinical Endocrinology",
      ],
    },
  },
  {
    id: "2",
    title: "The Benefits of Regular Exercise",
    author: "Dr. Michael Chen",
    category: "Fitness",
    submittedAt: "2024-03-14T15:45:00",
    status: "pending",
    details: {
      content:
        "Regular physical activity is one of the most important things you can do for your health...",
      summary:
        "Exploring the numerous health benefits of maintaining a regular exercise routine.",
      tags: ["exercise", "fitness", "health", "wellness"],
      imageUrl: "https://example.com/exercise-image.jpg",
      references: [
        "CDC Physical Activity Guidelines",
        "American College of Sports Medicine",
        "International Journal of Behavioral Nutrition",
      ],
    },
  },
  // Add more mock data as needed
];

export function PendingArticlesTable() {
  const [selectedArticle, setSelectedArticle] = useState<PendingArticle | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (article: PendingArticle) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const handleApprove = () => {
    // Mock API call - replace with actual API call
    console.log("Approving article:", selectedArticle?.id);
    setIsModalOpen(false);
  };

  const handleReject = () => {
    // Mock API call - replace with actual API call
    console.log("Rejecting article:", selectedArticle?.id);
    setIsModalOpen(false);
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title mb-4">Pending Articles</h2>

        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Submitted</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockPendingArticles.map((article) => (
                <tr key={article.id}>
                  <td>{article.title}</td>
                  <td>{article.author}</td>
                  <td>{article.category}</td>
                  <td>{new Date(article.submittedAt).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`badge ${
                        article.status === "pending"
                          ? "badge-warning"
                          : article.status === "approved"
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {article.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleViewDetails(article)}
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
        {isModalOpen && selectedArticle && (
          <div className="modal modal-open">
            <div className="modal-box max-w-3xl">
              <h3 className="font-bold text-lg mb-4">
                {selectedArticle.title}
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="font-semibold">Author:</p>
                  <p>{selectedArticle.author}</p>
                </div>
                <div>
                  <p className="font-semibold">Category:</p>
                  <p>{selectedArticle.category}</p>
                </div>
                <div>
                  <p className="font-semibold">Submitted:</p>
                  <p>
                    {new Date(selectedArticle.submittedAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Tags:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedArticle.details.tags.map((tag, index) => (
                      <span key={index} className="badge badge-outline">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="font-semibold">Summary:</p>
                <p className="mt-1">{selectedArticle.details.summary}</p>
              </div>

              <div className="mb-4">
                <p className="font-semibold">Content:</p>
                <p className="mt-1">{selectedArticle.details.content}</p>
              </div>

              <div className="mb-4">
                <p className="font-semibold">References:</p>
                <ul className="list-disc list-inside mt-1">
                  {selectedArticle.details.references.map((ref, index) => (
                    <li key={index}>{ref}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <p className="font-semibold mb-2">Featured Image:</p>
                <img
                  src={selectedArticle.details.imageUrl}
                  alt="Article"
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
