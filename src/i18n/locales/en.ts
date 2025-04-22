export default {
  common: {
    dashboard: 'Dashboard',
    settings: 'Settings',
    theme: {
      title: 'Theme Settings',
      light: 'Light Mode',
      dark: 'Dark Mode',
    },
    language: {
      title: 'Language Settings',
      en: 'English',
      ja: 'Japanese',
    },
  },
  apps: {
    dashboard: 'Dashboard',
    sun: 'SUN',
    mercury: 'MERCURY',
    venus: 'VENUS',
    mars: 'MARS',
    jupiter: 'JUPITER',
    saturn: 'SATURN',
    uranus: 'URANUS',
    neptune: 'NEPTUNE'
  },
  dashboard: {
    metrics: {
      moon: 'Moon Metrics',
      northStar: 'North Star Metrics',
    },
    roles: {
      manager: 'Manager View',
    },
    kpi: {
      arr: 'ARR',
      arrProgress: 'Quarterly Target Progress',
      nrr: 'NRR',
      milestones: 'Key Milestones',
      trainingApplicants: 'Training Applicants',
      trainingCompletion: 'Training Completion Rate',
    },
  },
  contracts: {
    title: 'Contracts',
    list: 'Contract List',
    new: 'New Contract',
    renewal: 'Contract Renewal',
    edit: 'Edit Contract',
    form: {
      clientName: 'Client Name',
      startDate: 'Start Date',
      endDate: 'End Date',
      annualValue: 'Annual Value (ARR)',
      notes: 'Notes',
      save: 'Save',
      cancel: 'Cancel',
      required: 'This field is required',
      invalidValue: 'Please enter a valid value',
    },
    initialDate: 'Initial Contract Date',
  },
  chart: {
    arr: {
      title: 'ARR Trend',
      period: {
        '1y': '1 Year',
        '2y': '2 Years',
        '3y': '3 Years',
        'all': 'All Time',
      },
    },
  },
  targets: {
    title: 'ARR Targets',
    year: 'Year',
    month: 'Month',
    amount: 'Target Amount',
  },
  manager: {
    menu: {
      contracts: 'Contracts',
      targets: 'ARR Targets',
    },
  },
  admin: {
    userManagement: {
      title: 'User Management',
      searchPlaceholder: 'Search users...',
      allRoles: 'All Roles',
      table: {
        user: 'User',
        role: 'Role',
        status: 'Status',
        lastLogin: 'Last Login',
        actions: 'Actions'
      },
      roles: {
        admin: 'Administrator',
        hr_manager: 'HR Manager',
        manager: 'Manager',
        employee: 'Employee'
      },
      roleDescriptions: {
        admin: 'Full system access and control',
        hr_manager: 'HR management and employee data access',
        manager: 'Team management and reporting access',
        employee: 'Basic access to personal data and tools'
      },
      status: {
        active: 'Active',
        inactive: 'Inactive'
      },
      statusDescriptions: {
        active: 'User can access the system',
        inactive: 'User access is disabled'
      },
      actions: {
        edit: 'Edit'
      },
      modal: {
        updateRole: 'Update User Role',
        updateStatus: 'Update User Status'
      }
    }
  }
};