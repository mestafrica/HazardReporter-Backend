export const roles = [
    {
        role: 'admin',
        permissions: [
            'read_users',
            'create_user',
            'update_user',
            'delete_user',
            'view_reports',
            'update_report_status',
            'manage_announcements',
        ]
    },
    {
        role: 'user',
        permissions: [
            'update_user',
            'delete_user'
        ]
    }
]