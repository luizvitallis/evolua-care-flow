import { supabase } from './supabaseClient';

function createEntityAPI(tableName) {
  return {
    async filter(conditions = {}, orderBy = null, limit = null) {
      let query = supabase.from(tableName).select('*');

      for (const [key, value] of Object.entries(conditions)) {
        query = query.eq(key, value);
      }

      if (orderBy) {
        const descending = orderBy.startsWith('-');
        const column = descending ? orderBy.slice(1) : orderBy;
        query = query.order(column, { ascending: !descending });
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },

    async list(orderBy = null, limit = null) {
      let query = supabase.from(tableName).select('*');

      if (orderBy) {
        const descending = orderBy.startsWith('-');
        const column = descending ? orderBy.slice(1) : orderBy;
        query = query.order(column, { ascending: !descending });
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },

    async create(data) {
      const { data: created, error } = await supabase
        .from(tableName)
        .insert([data])
        .select()
        .single();
      if (error) throw error;
      return created;
    },

    async update(id, data) {
      const { data: updated, error } = await supabase
        .from(tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return updated;
    },

    async delete(id) {
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw error;
    },
  };
}

export const base44 = {
  entities: {
    AppUser: createEntityAPI('app_users'),
    Evolution: createEntityAPI('evolutions'),
  },
};
