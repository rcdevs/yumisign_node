declare module 'yumisign' {
  namespace YumiSign {
    type Permission =
      | 'create_workflow'
      | 'move_created_workflow'
      | 'move_others_workflow'
      | 'delete_created_workflow'
      | 'delete_others_workflow'
      | 'edit_created_workflow'
      | 'edit_others_workflow'
      | 'view_created_workflow'
      | 'view_others_workflow'
      | 'create_template'
      | 'delete_created_template'
      | 'delete_others_template'
      | 'edit_created_template'
      | 'edit_others_template'
      | 'move_created_template'
      | 'move_others_template'
      | 'view_created_template'
      | 'view_others_template'
      | 'create_archive'
      | 'delete_archive_for_me'
      | 'delete_archive_for_everyone'
      | 'edit_hold_archive'
      | 'edit_others_archive'
      | 'view_hold_archive'
      | 'view_others_archive'
      | 'move_hold_archive'
      | 'move_others_archive'
      | 'delete_workspace'
      | 'edit_workspace'
      | 'add_workspace_user'
      | 'remove_workspace_user'
      | 'edit_workspace_user'
      | 'create_template_out_of_template'
      | 'create_template_out_of_workflow'
      | 'create_workflow_out_of_template'
      | 'create_workflow_out_of_workflow'
      | 'view_archive_summary'
      | 'upload_archive_to_cloud'
      | 'manage_tags'
      | 'tag_workflow'
      | 'tag_archive'
      | 'tag_template';

    interface Workspace {
      /**
       * Unique identifier.
       */
      id: number;

      /**
       * Name of the workspace.
       */
      name: string;

      /**
       * A list of permissions for current user.
       */
      permissions: Permission[];
    }
  }
}
