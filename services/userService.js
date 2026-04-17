import { supabase } from './supabase';

export const userService = {
  async getUser(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || { username: '', city: '', country: ''};
  },

  async upsertUser(userId, userData) {
    const { data, error } = await supabase
      .from('users')
      .upsert({ id: userId, ...userData, updated_at: new Date() })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};