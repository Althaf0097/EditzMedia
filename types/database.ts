export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            categories: {
                Row: {
                    created_at: string
                    id: number
                    name: string
                    type: string
                }
                Insert: {
                    created_at?: string
                    id?: number
                    name: string
                    type: string
                }
                Update: {
                    created_at?: string
                    id?: number
                    name?: string
                    type?: string
                }
                Relationships: []
            }
            media_assets: {
                Row: {
                    asset_type: string
                    category_id: number | null
                    created_at: string
                    description: string | null
                    file_url: string
                    format: string
                    id: string
                    is_recommended: boolean | null
                    title: string
                    uploader_id: string | null
                }
                Insert: {
                    asset_type: string
                    category_id?: number | null
                    created_at?: string
                    description?: string | null
                    file_url: string
                    format: string
                    id?: string
                    is_recommended?: boolean | null
                    title: string
                    uploader_id?: string | null
                }
                Update: {
                    asset_type?: string
                    category_id?: number | null
                    created_at?: string
                    description?: string | null
                    file_url?: string
                    format?: string
                    id?: string
                    is_recommended?: boolean | null
                    title?: string
                    uploader_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "media_assets_category_id_fkey"
                        columns: ["category_id"]
                        isOneToOne: false
                        referencedRelation: "categories"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "media_assets_uploader_id_fkey"
                        columns: ["uploader_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            profiles: {
                Row: {
                    id: string
                    email: string | null
                    is_admin: boolean
                    created_at: string
                    avatar_url: string | null
                    display_name: string | null
                }
                Insert: {
                    id: string
                    email?: string | null
                    is_admin?: boolean
                    created_at?: string
                    avatar_url?: string | null
                    display_name?: string | null
                }
                Update: {
                    id?: string
                    email?: string | null
                    is_admin?: boolean
                    created_at?: string
                    avatar_url?: string | null
                    display_name?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey"
                        columns: ["id"]
                        isOneToOne: true
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            saved_items: {
                Row: {
                    id: string
                    user_id: string
                    media_asset_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    media_asset_id: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    media_asset_id?: string
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "saved_items_media_asset_id_fkey"
                        columns: ["media_asset_id"]
                        isOneToOne: false
                        referencedRelation: "media_assets"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "saved_items_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Enums: {}
        CompositeTypes: {}
    }
}
