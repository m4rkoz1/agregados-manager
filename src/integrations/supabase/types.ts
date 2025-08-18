export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      agregados: {
        Row: {
          ativo: boolean | null
          boa_conduta: boolean | null
          capacidade_carga_m3: number | null
          capacidade_carga_toneladas: number | null
          categoria_cnh: string
          contato_motorista: string | null
          contato_proprietario: string | null
          cor_veiculo: string | null
          cpf_proprietario: string | null
          created_at: string
          data_crlv: string | null
          data_detizacao: string | null
          data_inclusao: string
          data_saida: string | null
          data_vigilancia_sanitaria: string | null
          endereco_proprietario: string | null
          escolaridade: string | null
          escolaridade_proprietario: string | null
          estado_civil: string | null
          estado_civil_proprietario: string | null
          id: string
          local_pernoite: string | null
          nome_motorista: string
          nome_pai: string | null
          nome_pai_proprietario: string | null
          numero_antt: string | null
          numero_cnh: string
          observacoes: string | null
          pernoite: boolean | null
          placa_veiculo: string
          pontos_cnh: number | null
          porta_lateral: boolean | null
          proprietario_veiculo: string
          quantidade_pallets: number | null
          restricoes_rota: string | null
          rg_proprietario: string | null
          tipo_veiculo: string
          updated_at: string
          validade_cnh: string
        }
        Insert: {
          ativo?: boolean | null
          boa_conduta?: boolean | null
          capacidade_carga_m3?: number | null
          capacidade_carga_toneladas?: number | null
          categoria_cnh: string
          contato_motorista?: string | null
          contato_proprietario?: string | null
          cor_veiculo?: string | null
          cpf_proprietario?: string | null
          created_at?: string
          data_crlv?: string | null
          data_detizacao?: string | null
          data_inclusao?: string
          data_saida?: string | null
          data_vigilancia_sanitaria?: string | null
          endereco_proprietario?: string | null
          escolaridade?: string | null
          escolaridade_proprietario?: string | null
          estado_civil?: string | null
          estado_civil_proprietario?: string | null
          id?: string
          local_pernoite?: string | null
          nome_motorista: string
          nome_pai?: string | null
          nome_pai_proprietario?: string | null
          numero_antt?: string | null
          numero_cnh: string
          observacoes?: string | null
          pernoite?: boolean | null
          placa_veiculo: string
          pontos_cnh?: number | null
          porta_lateral?: boolean | null
          proprietario_veiculo: string
          quantidade_pallets?: number | null
          restricoes_rota?: string | null
          rg_proprietario?: string | null
          tipo_veiculo: string
          updated_at?: string
          validade_cnh: string
        }
        Update: {
          ativo?: boolean | null
          boa_conduta?: boolean | null
          capacidade_carga_m3?: number | null
          capacidade_carga_toneladas?: number | null
          categoria_cnh?: string
          contato_motorista?: string | null
          contato_proprietario?: string | null
          cor_veiculo?: string | null
          cpf_proprietario?: string | null
          created_at?: string
          data_crlv?: string | null
          data_detizacao?: string | null
          data_inclusao?: string
          data_saida?: string | null
          data_vigilancia_sanitaria?: string | null
          endereco_proprietario?: string | null
          escolaridade?: string | null
          escolaridade_proprietario?: string | null
          estado_civil?: string | null
          estado_civil_proprietario?: string | null
          id?: string
          local_pernoite?: string | null
          nome_motorista?: string
          nome_pai?: string | null
          nome_pai_proprietario?: string | null
          numero_antt?: string | null
          numero_cnh?: string
          observacoes?: string | null
          pernoite?: boolean | null
          placa_veiculo?: string
          pontos_cnh?: number | null
          porta_lateral?: boolean | null
          proprietario_veiculo?: string
          quantidade_pallets?: number | null
          restricoes_rota?: string | null
          rg_proprietario?: string | null
          tipo_veiculo?: string
          updated_at?: string
          validade_cnh?: string
        }
        Relationships: []
      }
      agregados_historico: {
        Row: {
          agregado_id: string
          campo_alterado: string
          data_alteracao: string
          id: string
          usuario_alteracao: string | null
          valor_anterior: string | null
          valor_novo: string | null
        }
        Insert: {
          agregado_id: string
          campo_alterado: string
          data_alteracao?: string
          id?: string
          usuario_alteracao?: string | null
          valor_anterior?: string | null
          valor_novo?: string | null
        }
        Update: {
          agregado_id?: string
          campo_alterado?: string
          data_alteracao?: string
          id?: string
          usuario_alteracao?: string | null
          valor_anterior?: string | null
          valor_novo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agregados_historico_agregado_id_fkey"
            columns: ["agregado_id"]
            isOneToOne: false
            referencedRelation: "agregados"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
