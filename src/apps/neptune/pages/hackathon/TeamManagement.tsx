import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertCircle,
  Users,
  Search,
  UserPlus,
  UserMinus,
  Check
} from 'lucide-react';
import { useHackathonStore } from '../../../../store/hackathon';
import { useAuthStore } from '../../../../store/auth';
import { useAuth } from '../../../../contexts/AuthContext';
import { UserRole } from '../../../../types/auth';
import { HackathonTeam } from '../../../../types/hackathon';

const TeamManagement: React.FC = () => {
  const navigate = useNavigate();
  const { authUser } = useAuth();
  const { getAllUsers } = useAuthStore();
  const { 
    teamMembers,
    addTeamMember,
    updateTeamMember
  } = useHackathonStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<HackathonTeam | ''>('');
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 管理者権限チェック
  if (authUser?.role !== UserRole.ADMIN) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Only administrators can manage team members.
          </p>
        </div>
      </div>
    );
  }

  // ユーザー一覧の取得
  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getAllUsers();
        setUsers(allUsers);
      } catch (error) {
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [getAllUsers]);

  // フィルタリングされたユーザー一覧
  const filteredUsers = users.filter(user => {
    const matchesSearch = (
      user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesTeam = !selectedTeam || teamMembers.find(
      tm => tm.userId === user.uid && tm.team === selectedTeam
    );
    return matchesSearch && matchesTeam;
  });

  // チームメンバーの追加/更新
  const handleTeamAssignment = async (userId: string, team: HackathonTeam | null) => {
    try {
      const existingMember = teamMembers.find(tm => tm.userId === userId);
      if (team) {
        if (existingMember) {
          await updateTeamMember(userId, team);
        } else {
          await addTeamMember(userId, team);
        }
      }
    } catch (error) {
      setError('Failed to update team member');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Team Management
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>
        
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value as HackathonTeam | '')}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="">All Teams</option>
          <option value="A">Team A</option>
          <option value="B">Team B</option>
          <option value="C">Team C</option>
          <option value="D">Team D</option>
        </select>
      </div>

      {/* User List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Current Team
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => {
                const teamMember = teamMembers.find(tm => tm.userId === user.uid);
                return (
                  <tr key={user.uid} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={user.photoURL}
                          alt={user.displayName}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.displayName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {teamMember ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Team {teamMember.team}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Not assigned
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {['A', 'B', 'C', 'D'].map((team) => (
                          <button
                            key={team}
                            onClick={() => handleTeamAssignment(user.uid, team as HackathonTeam)}
                            className={`p-2 rounded-lg ${
                              teamMember?.team === team
                                ? 'bg-primary-100 text-primary-500 dark:bg-primary-900/20'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            {teamMember?.team === team ? (
                              <Check className="w-5 h-5" />
                            ) : (
                              <UserPlus className="w-5 h-5" />
                            )}
                          </button>
                        ))}
                        {teamMember && (
                          <button
                            onClick={() => handleTeamAssignment(user.uid, null)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-red-500"
                          >
                            <UserMinus className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;