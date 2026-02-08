import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://vxqalqfhfkavtvaijkcn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4cWFscWZoZmthdnR2YWlqa2NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwOTE4NzUsImV4cCI6MjA3OTY2Nzg3NX0.Uj9r8clA4t3UMpR6Sc6V0PvexoJJwVLLHIq4MrNRxE8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const parseNumber = (value) => {
  if (!value || value === "") return null;
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
};

export const uploadImage = async (file) => {
  try {
    if (!file) return null;
    const filename = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
    
    const { error } = await supabase.storage
      .from('logos')
      .upload(filename, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from('logos')
      .getPublicUrl(filename);
      
    return data.publicUrl;
  } catch (e) {
    return null;
  }
};

export const getClients = async () => {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('created_at', { ascending: false });
  
  return error ? [] : data;
};

export const getClientById = async (id) => {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', id)
    .single();
    
  return error ? null : data;
};

export const insertClient = async (clientData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    let finalLogoUrl = clientData.logo;
    if (clientData.logo && typeof clientData.logo !== 'string') {
      finalLogoUrl = await uploadImage(clientData.logo);
    }

    const { error } = await supabase.from('clientes').insert({
      user_id: user.id,
      nombre: clientData.name,
      email: clientData.email,
      telefono: clientData.phone,
      lat: parseNumber(clientData.lat),
      lng: parseNumber(clientData.lng),
      logo_url: finalLogoUrl
    });

    return !error;
  } catch (e) {
    return false;
  }
};

export const updateClient = async (id, clientData) => {
  try {
    let finalLogoUrl = clientData.logo;
    if (clientData.logo && typeof clientData.logo !== 'string') {
      finalLogoUrl = await uploadImage(clientData.logo);
    }

    const { error } = await supabase.from('clientes').update({
      nombre: clientData.name,
      email: clientData.email,
      telefono: clientData.phone,
      lat: parseNumber(clientData.lat),
      lng: parseNumber(clientData.lng),
      logo_url: finalLogoUrl
    }).eq('id', id);

    return !error;
  } catch (e) { return false; }
};

export const deleteClient = async (id) => {
  const { error } = await supabase.from('clientes').delete().eq('id', id);
  return !error;
};

export const getAllProjects = async () => {
  const { data, error } = await supabase
    .from('proyectos')
    .select('*')
    .order('created_at', { ascending: false });
  return error ? [] : data;
};

export const getProjectById = async (id) => {
  const { data, error } = await supabase
    .from('proyectos')
    .select('*')
    .eq('id', id)
    .single();
  return error ? null : data;
};

export const insertProject = async (project) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase.from('proyectos').insert({
    title: project.title,
    description: project.description,
    price: parseNumber(project.price),
    deadline: project.deadline,
    status: project.status,
    client_id: project.client_id,
    user_id: user.id
  });
  return !error;
};

export const updateProject = async (id, projectData) => {
  const { error } = await supabase.from('proyectos').update({
    title: projectData.title,
    description: projectData.description,
    price: parseNumber(projectData.price),
    deadline: projectData.deadline,
    status: projectData.status,
    client_id: projectData.client_id
  }).eq('id', id);
  return !error;
};

export const deleteProject = async (id) => {
  const { error } = await supabase.from('proyectos').delete().eq('id', id);
  return !error;
};

export const getAllInvoices = async () => {
  const { data, error } = await supabase
    .from('facturas')
    .select('*')
    .order('created_at', { ascending: false });
  return error ? [] : data;
};

export const getInvoiceById = async (id) => {
  const { data, error } = await supabase
    .from('facturas')
    .select('*')
    .eq('id', id)
    .single();
  return error ? null : data;
};

export const insertInvoice = async (invoice) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase.from('facturas').insert({
    number: invoice.number,
    amount: parseNumber(invoice.amount),
    date: invoice.date,
    status: invoice.status,
    project_id: invoice.project_id,
    user_id: user.id
  });
  return !error;
};

export const updateInvoice = async (id, invoiceData) => {
  const { error } = await supabase.from('facturas').update({
    number: invoiceData.number,
    amount: parseNumber(invoiceData.amount),
    date: invoiceData.date,
    status: invoiceData.status,
    project_id: invoiceData.project_id
  }).eq('id', id);
  return !error;
};

export const deleteInvoice = async (id) => {
  const { error } = await supabase.from('facturas').delete().eq('id', id);
  return !error;
};

export const registerUser = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { success: !error, user: data.user, error: error?.message };
};

export const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { success: !error, token: data.session?.access_token, user: data.user, error: error?.message };
};

export const logoutUser = async () => {
  await supabase.auth.signOut();
};