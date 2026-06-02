-- 1. Añadimos la columna user_id a las tres tablas
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid();
ALTER TABLE facturas ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid();
ALTER TABLE proyectos ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid();

-- 2. Activamos el muro de seguridad (RLS)
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE facturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE proyectos ENABLE ROW LEVEL SECURITY;

-- 3. Creamos la política de "Privacidad Absoluta" para Clientes
CREATE POLICY "Privacidad Clientes" ON clientes
FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 4. Creamos la política para Facturas
CREATE POLICY "Privacidad Facturas" ON facturas
FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 5. Creamos la política para Proyectos
CREATE POLICY "Privacidad Proyectos" ON proyectos
FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
