-- Create logos table
CREATE TABLE IF NOT EXISTS public.logos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    variant VARCHAR(50) NOT NULL DEFAULT 'main',
    url TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    alt_text TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_logos_variant ON public.logos(variant);
CREATE INDEX IF NOT EXISTS idx_logos_active ON public.logos(is_active);
CREATE INDEX IF NOT EXISTS idx_logos_display_order ON public.logos(display_order);

-- Enable Row Level Security
ALTER TABLE public.logos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow public read access to active logos
CREATE POLICY "Allow public read access to active logos" ON public.logos
    FOR SELECT USING (is_active = true);

-- Allow authenticated users to read all logos
CREATE POLICY "Allow authenticated users to read all logos" ON public.logos
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow admin users to insert logos
CREATE POLICY "Allow admin users to insert logos" ON public.logos
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow admin users to update logos
CREATE POLICY "Allow admin users to update logos" ON public.logos
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow admin users to delete logos
CREATE POLICY "Allow admin users to delete logos" ON public.logos
    FOR DELETE USING (auth.role() = 'authenticated');

-- Insert some default logos
INSERT INTO public.logos (variant, url, title, alt_text, is_active, display_order) VALUES
('main', 'https://via.placeholder.com/300x100/3B82F6/FFFFFF?text=EventHubble', 'EventHubble Main Logo', 'EventHubble - Event Management Platform', true, 1),
('footer', 'https://via.placeholder.com/200x60/6B7280/FFFFFF?text=EventHubble', 'EventHubble Footer Logo', 'EventHubble Footer', true, 2),
('favicon', 'https://via.placeholder.com/32x32/3B82F6/FFFFFF?text=EH', 'EventHubble Favicon', 'EventHubble Favicon', true, 3)
ON CONFLICT (variant) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_logos_updated_at 
    BEFORE UPDATE ON public.logos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT SELECT ON public.logos TO anon;
GRANT ALL ON public.logos TO authenticated;
GRANT ALL ON public.logos TO service_role; 