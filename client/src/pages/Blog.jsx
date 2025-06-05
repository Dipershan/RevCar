import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Blog = () => {
  const [blogs] = useState([
    {
      id: 1,
      title: "10 Tips for a Safe and Comfortable Road Trip",
      excerpt: "Planning a road trip? Here are essential tips to make your journey safe and enjoyable...",
      image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800",
      date: "2024-03-15",
      author: "John Doe",
      category: "Travel Tips"
    },
    {
      id: 2,
      title: "Why Electric Cars Are the Future of Car Rental",
      excerpt: "Discover how electric vehicles are transforming the car rental industry...",
      image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7",
      date: "2024-03-12",
      author: "Jane Smith",
      category: "Industry News"
    },
    {
      id: 3,
      title: "Best Scenic Drives in Nepal",
      excerpt: "Explore the most beautiful driving routes through Nepal's stunning landscapes...",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa",
      date: "2024-03-10",
      author: "Ram Kumar",
      category: "Destinations"
    }
  ]);

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <div className="py-5 text-center" style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white'
      }}>
        <div className="container py-5">
          <h1 className="display-4 fw-bold">Our Blog</h1>
          <p className="lead">Stay Updated with Latest News and Travel Tips</p>
        </div>
      </div>

      <div className="container py-5">
        <div className="row">
          {/* Main Content */}
          <div className="col-lg-8">
            {blogs.map(blog => (
              <div key={blog.id} className="card mb-4 border-0 shadow-sm">
                <div className="row g-0">
                  <div className="col-md-4">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="img-fluid rounded-start h-100 object-fit-cover"
                      style={{ minHeight: '250px' }}
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge" style={{
                          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                          color: 'white'
                        }}>{blog.category}</span>
                        <small className="text-muted">{blog.date}</small>
                      </div>
                      <h3 className="card-title h4">{blog.title}</h3>
                      <p className="card-text">{blog.excerpt}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <img
                            src={`https://ui-avatars.com/api/?name=${blog.author}&background=random`}
                            alt={blog.author}
                            className="rounded-circle me-2"
                            width="30"
                          />
                          <small className="text-muted">{blog.author}</small>
                        </div>
                        <Link to={`/blog/${blog.id}`} className="btn btn-outline-primary">Read More</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Search */}
            <div className="card mb-4 border-0 shadow-sm">
              <div className="card-body">
                <h4 className="card-title h5 mb-4">Search</h4>
                <div className="input-group">
                  <input type="text" className="form-control" placeholder="Search posts..." />
                  <button className="btn btn-primary" type="button" style={{
                    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                    border: 'none'
                  }}>
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="card mb-4 border-0 shadow-sm">
              <div className="card-body">
                <h4 className="card-title h5 mb-4">Categories</h4>
                <div className="list-group list-group-flush">
                  <Link to="#" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                    Travel Tips
                    <span className="badge bg-primary rounded-pill">12</span>
                  </Link>
                  <Link to="#" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                    Industry News
                    <span className="badge bg-primary rounded-pill">8</span>
                  </Link>
                  <Link to="#" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                    Destinations
                    <span className="badge bg-primary rounded-pill">15</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Posts */}
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h4 className="card-title h5 mb-4">Recent Posts</h4>
                <div className="list-group list-group-flush">
                  {blogs.map(blog => (
                    <Link key={blog.id} to={`/blog/${blog.id}`} className="list-group-item list-group-item-action">
                      <div className="d-flex w-100 justify-content-between">
                        <h6 className="mb-1">{blog.title}</h6>
                      </div>
                      <small className="text-muted">{blog.date}</small>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Blog; 