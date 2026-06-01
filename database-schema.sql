CREATE TABLE businesses (
  id INTEGER PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  business_type VARCHAR(80) NOT NULL,
  country VARCHAR(80) NOT NULL,
  email VARCHAR(160),
  phone VARCHAR(40),
  tagline TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE services (
  id INTEGER PRIMARY KEY,
  business_id INTEGER NOT NULL,
  title VARCHAR(140) NOT NULL,
  slug VARCHAR(160) NOT NULL UNIQUE,
  summary TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (business_id) REFERENCES businesses(id)
);

CREATE TABLE enquiries (
  id INTEGER PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  service_slug VARCHAR(160),
  message TEXT NOT NULL,
  status VARCHAR(40) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_services_business_id ON services(business_id);
CREATE INDEX idx_enquiries_status ON enquiries(status);
CREATE INDEX idx_enquiries_created_at ON enquiries(created_at);
