-- Create tables in Supabase
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    tag_name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE inputs (
    id SERIAL PRIMARY KEY,
    tag_id INT NOT NULL,
    input_text VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_tag
      FOREIGN KEY(tag_id) 
      REFERENCES tags(id)
      ON DELETE CASCADE
);

CREATE TABLE responses (
    id SERIAL PRIMARY KEY,
    tag_id INT NOT NULL,
    response_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_tag
      FOREIGN KEY(tag_id) 
      REFERENCES tags(id)
      ON DELETE CASCADE
);

-- Create a function to update timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for tags table
CREATE TRIGGER update_tags_timestamp
BEFORE UPDATE ON tags
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();


-- Enable Row Level Security on all tables
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE inputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Enable public read access for tags" 
ON tags FOR SELECT USING (true);

CREATE POLICY "Enable public read access for inputs" 
ON inputs FOR SELECT USING (true);

CREATE POLICY "Enable public read access for responses" 
ON responses FOR SELECT USING (true);

-- Public insert access policies
CREATE POLICY "Enable public insert access for tags" 
ON tags FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable public insert access for inputs" 
ON inputs FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable public insert access for responses" 
ON responses FOR INSERT WITH CHECK (true);

-- Public update access policies
CREATE POLICY "Enable public update access for tags" 
ON tags FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Enable public update access for inputs" 
ON inputs FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Enable public update access for responses" 
ON responses FOR UPDATE USING (true) WITH CHECK (true);

-- Public delete access policies
CREATE POLICY "Enable public delete access for tags" 
ON tags FOR DELETE USING (true);

CREATE POLICY "Enable public delete access for inputs" 
ON inputs FOR DELETE USING (true);

CREATE POLICY "Enable public delete access for responses" 
ON responses FOR DELETE USING (true);