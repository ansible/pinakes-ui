import { AnyObject } from './common-types';

declare module '@redhat-cloud-services/sources-client' {
  export interface ServiceOffering {
    archived_at?: string;
    created_at?: string;
    description?: string;
    display_name?: string;
    distributor?: string;
    documentation_url?: string;
    extra?: AnyObject;
    id?: string;
    last_seen_at?: string;
    long_description?: string;
    name?: string;
    refresh_state_part_id?: string;
    service_inventory_id?: string;
    service_offering_icon_id?: string;
    source_created_at?: string;
    source_deleted_at?: string;
    source_id?: string;
    source_ref?: string;
    subscription_id?: string;
    support_url?: string;
    updated_at?: string;
  }

  export interface ServiceInventory {
    archived_at?: string;
    created_at?: string;
    description?: string;
    extra?: AnyObject;
    id?: string;
    last_seen_at?: string;
    name?: string;
    refresh_state_part_id?: string;
    source_created_at?: string;
    source_id?: string;
    source_ref?: string;
    source_updated_at?: string;
    updated_at?: string;
  }
}
