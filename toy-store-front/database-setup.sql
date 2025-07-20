-- =====================================================
-- TOY STORE DATABASE SETUP
-- Para usar no Neon ou PostgreSQL
-- =====================================================

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABELA DE USUÁRIOS (AUTENTICAÇÃO)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABELA DE CLIENTES
-- =====================================================
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    birth_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABELA DE VENDAS
-- =====================================================
CREATE TABLE IF NOT EXISTS sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    sale_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(name);
CREATE INDEX IF NOT EXISTS idx_sales_customer_id ON sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- =====================================================
-- DADOS DE EXEMPLO - USUÁRIOS
-- =====================================================
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin User', 'admin@toystore.com', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV', 'admin'),
('Manager User', 'manager@toystore.com', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV', 'manager')
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- DADOS DE EXEMPLO - CLIENTES
-- =====================================================
INSERT INTO customers (name, email, birth_date) VALUES
('Ana Beatriz Costa Silva', 'ana.beatriz@email.com', '1990-03-15'),
('João Silva', 'joao.silva@email.com', '1985-07-22'),
('Carlos Eduardo Figueiredo', 'carlos.eduardo@email.com', '1988-12-10'),
('Maria Santos', 'maria.santos@email.com', '1992-09-05'),
('Pedro Henrique Oliveira Lima', 'pedro.henrique@email.com', '1987-11-18'),
('Fernanda Rodrigues', 'fernanda.rodrigues@email.com', '1991-04-12'),
('Lucas Mendes', 'lucas.mendes@email.com', '1989-08-25'),
('Isabela Costa', 'isabela.costa@email.com', '1993-01-30'),
('Rafael Almeida', 'rafael.almeida@email.com', '1986-06-14'),
('Camila Ferreira', 'camila.ferreira@email.com', '1994-12-03')
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- DADOS DE EXEMPLO - VENDAS
-- =====================================================
-- Vendas para Ana Beatriz (maior volume)
INSERT INTO sales (customer_id, amount, sale_date) 
SELECT c.id, 150.00, '2024-01-01' FROM customers c WHERE c.email = 'ana.beatriz@email.com'
UNION ALL
SELECT c.id, 200.00, '2024-01-02' FROM customers c WHERE c.email = 'ana.beatriz@email.com'
UNION ALL
SELECT c.id, 300.00, '2024-01-03' FROM customers c WHERE c.email = 'ana.beatriz@email.com'
UNION ALL
SELECT c.id, 250.00, '2024-01-04' FROM customers c WHERE c.email = 'ana.beatriz@email.com'
UNION ALL
SELECT c.id, 180.00, '2024-01-05' FROM customers c WHERE c.email = 'ana.beatriz@email.com';

-- Vendas para Carlos Eduardo (maior média)
INSERT INTO sales (customer_id, amount, sale_date) 
SELECT c.id, 500.00, '2024-01-01' FROM customers c WHERE c.email = 'carlos.eduardo@email.com'
UNION ALL
SELECT c.id, 450.00, '2024-01-02' FROM customers c WHERE c.email = 'carlos.eduardo@email.com'
UNION ALL
SELECT c.id, 600.00, '2024-01-03' FROM customers c WHERE c.email = 'carlos.eduardo@email.com';

-- Vendas para João Silva (maior frequência)
INSERT INTO sales (customer_id, amount, sale_date) 
SELECT c.id, 50.00, '2024-01-01' FROM customers c WHERE c.email = 'joao.silva@email.com'
UNION ALL
SELECT c.id, 75.00, '2024-01-02' FROM customers c WHERE c.email = 'joao.silva@email.com'
UNION ALL
SELECT c.id, 60.00, '2024-01-03' FROM customers c WHERE c.email = 'joao.silva@email.com'
UNION ALL
SELECT c.id, 80.00, '2024-01-04' FROM customers c WHERE c.email = 'joao.silva@email.com'
UNION ALL
SELECT c.id, 65.00, '2024-01-05' FROM customers c WHERE c.email = 'joao.silva@email.com'
UNION ALL
SELECT c.id, 70.00, '2024-01-06' FROM customers c WHERE c.email = 'joao.silva@email.com'
UNION ALL
SELECT c.id, 55.00, '2024-01-07' FROM customers c WHERE c.email = 'joao.silva@email.com';

-- Vendas para outros clientes
INSERT INTO sales (customer_id, amount, sale_date) 
SELECT c.id, 120.00, '2024-01-01' FROM customers c WHERE c.email = 'maria.santos@email.com'
UNION ALL
SELECT c.id, 90.00, '2024-01-02' FROM customers c WHERE c.email = 'maria.santos@email.com'
UNION ALL
SELECT c.id, 110.00, '2024-01-03' FROM customers c WHERE c.email = 'maria.santos@email.com';

INSERT INTO sales (customer_id, amount, sale_date) 
SELECT c.id, 200.00, '2024-01-01' FROM customers c WHERE c.email = 'pedro.henrique@email.com'
UNION ALL
SELECT c.id, 180.00, '2024-01-02' FROM customers c WHERE c.email = 'pedro.henrique@email.com'
UNION ALL
SELECT c.id, 220.00, '2024-01-03' FROM customers c WHERE c.email = 'pedro.henrique@email.com'
UNION ALL
SELECT c.id, 160.00, '2024-01-04' FROM customers c WHERE c.email = 'pedro.henrique@email.com';

-- Vendas para demonstrar estatísticas diárias
INSERT INTO sales (customer_id, amount, sale_date) 
SELECT c.id, 100.00, '2024-01-08' FROM customers c WHERE c.email = 'fernanda.rodrigues@email.com'
UNION ALL
SELECT c.id, 130.00, '2024-01-09' FROM customers c WHERE c.email = 'lucas.mendes@email.com'
UNION ALL
SELECT c.id, 95.00, '2024-01-10' FROM customers c WHERE c.email = 'isabela.costa@email.com'
UNION ALL
SELECT c.id, 140.00, '2024-01-11' FROM customers c WHERE c.email = 'rafael.almeida@email.com'
UNION ALL
SELECT c.id, 85.00, '2024-01-12' FROM customers c WHERE c.email = 'camila.ferreira@email.com';

-- =====================================================
-- FUNÇÕES ÚTEIS
-- =====================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sales_updated_at BEFORE UPDATE ON sales FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

-- View para estatísticas de clientes
CREATE OR REPLACE VIEW customer_statistics AS
SELECT 
    c.id,
    c.name,
    c.email,
    COUNT(s.id) as total_sales,
    COALESCE(SUM(s.amount), 0) as total_amount,
    COALESCE(AVG(s.amount), 0) as average_amount,
    COUNT(DISTINCT s.sale_date) as unique_purchase_days
FROM customers c
LEFT JOIN sales s ON c.id = s.customer_id
GROUP BY c.id, c.name, c.email;

-- View para vendas diárias
CREATE OR REPLACE VIEW daily_sales AS
SELECT 
    sale_date,
    COUNT(*) as total_transactions,
    SUM(amount) as total_amount,
    AVG(amount) as average_amount
FROM sales
GROUP BY sale_date
ORDER BY sale_date;

-- =====================================================
-- VERIFICAÇÃO DOS DADOS
-- =====================================================
SELECT 'Database setup completed successfully!' as status;

-- Verificar dados inseridos
SELECT 'Users count:' as info, COUNT(*) as count FROM users
UNION ALL
SELECT 'Customers count:', COUNT(*) FROM customers
UNION ALL
SELECT 'Sales count:', COUNT(*) FROM sales;

-- Mostrar alguns clientes com suas letras faltantes
SELECT 
    name,
    CASE 
        WHEN name ILIKE '%a%' AND name ILIKE '%b%' AND name ILIKE '%c%' AND name ILIKE '%d%' AND name ILIKE '%e%' AND name ILIKE '%f%' AND name ILIKE '%g%' AND name ILIKE '%h%' AND name ILIKE '%i%' AND name ILIKE '%j%' AND name ILIKE '%k%' AND name ILIKE '%l%' AND name ILIKE '%m%' AND name ILIKE '%n%' AND name ILIKE '%o%' AND name ILIKE '%p%' AND name ILIKE '%q%' AND name ILIKE '%r%' AND name ILIKE '%s%' AND name ILIKE '%t%' AND name ILIKE '%u%' AND name ILIKE '%v%' AND name ILIKE '%w%' AND name ILIKE '%x%' AND name ILIKE '%y%' AND name ILIKE '%z%' THEN '-'
        WHEN name NOT ILIKE '%a%' THEN 'a'
        WHEN name NOT ILIKE '%b%' THEN 'b'
        WHEN name NOT ILIKE '%c%' THEN 'c'
        WHEN name NOT ILIKE '%d%' THEN 'd'
        WHEN name NOT ILIKE '%e%' THEN 'e'
        WHEN name NOT ILIKE '%f%' THEN 'f'
        WHEN name NOT ILIKE '%g%' THEN 'g'
        WHEN name NOT ILIKE '%h%' THEN 'h'
        WHEN name NOT ILIKE '%i%' THEN 'i'
        WHEN name NOT ILIKE '%j%' THEN 'j'
        WHEN name NOT ILIKE '%k%' THEN 'k'
        WHEN name NOT ILIKE '%l%' THEN 'l'
        WHEN name NOT ILIKE '%m%' THEN 'm'
        WHEN name NOT ILIKE '%n%' THEN 'n'
        WHEN name NOT ILIKE '%o%' THEN 'o'
        WHEN name NOT ILIKE '%p%' THEN 'p'
        WHEN name NOT ILIKE '%q%' THEN 'q'
        WHEN name NOT ILIKE '%r%' THEN 'r'
        WHEN name NOT ILIKE '%s%' THEN 's'
        WHEN name NOT ILIKE '%t%' THEN 't'
        WHEN name NOT ILIKE '%u%' THEN 'u'
        WHEN name NOT ILIKE '%v%' THEN 'v'
        WHEN name NOT ILIKE '%w%' THEN 'w'
        WHEN name NOT ILIKE '%x%' THEN 'x'
        WHEN name NOT ILIKE '%y%' THEN 'y'
        WHEN name NOT ILIKE '%z%' THEN 'z'
        ELSE '-'
    END as missing_letter
FROM customers
ORDER BY name; 