import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Users,
  UserPlus,
  Crown,
  X,
} from "lucide-react";
import Modal from "../components/Modal";
import { PageLoader } from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import toast from "react-hot-toast";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [formData, setFormData] = useState({
    team_name: "",
    team_leader_id: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    setTimeout(() => {
      setEmployees([
        {
          id: 1,
          name: "John Smith",
          position: "Senior Technician",
          email: "john@example.com",
        },
        {
          id: 2,
          name: "Sarah Johnson",
          position: "Maintenance Manager",
          email: "sarah@example.com",
        },
        {
          id: 3,
          name: "Mike Brown",
          position: "Electrician",
          email: "mike@example.com",
        },
        {
          id: 4,
          name: "Emily Davis",
          position: "Mechanic",
          email: "emily@example.com",
        },
        {
          id: 5,
          name: "Tom Wilson",
          position: "Technician",
          email: "tom@example.com",
        },
        {
          id: 6,
          name: "Lisa Anderson",
          position: "HVAC Specialist",
          email: "lisa@example.com",
        },
        {
          id: 7,
          name: "David Martinez",
          position: "Plumber",
          email: "david@example.com",
        },
        {
          id: 8,
          name: "Jennifer White",
          position: "Safety Officer",
          email: "jennifer@example.com",
        },
      ]);
      setTeams([
        {
          id: 1,
          team_name: "Alpha Maintenance",
          team_leader: { id: 2, name: "Sarah Johnson" },
          members: [
            { id: 1, name: "John Smith", position: "Senior Technician" },
            { id: 3, name: "Mike Brown", position: "Electrician" },
            { id: 5, name: "Tom Wilson", position: "Technician" },
          ],
        },
        {
          id: 2,
          team_name: "Beta Team",
          team_leader: { id: 4, name: "Emily Davis" },
          members: [
            { id: 6, name: "Lisa Anderson", position: "HVAC Specialist" },
            { id: 7, name: "David Martinez", position: "Plumber" },
          ],
        },
        {
          id: 3,
          team_name: "Night Shift Crew",
          team_leader: { id: 1, name: "John Smith" },
          members: [
            { id: 8, name: "Jennifer White", position: "Safety Officer" },
          ],
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredTeams = teams.filter(
    (team) =>
      team.team_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.team_leader?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openModal = (team = null) => {
    if (team) {
      setEditingTeam(team);
      setFormData({
        team_name: team.team_name,
        team_leader_id: team.team_leader?.id?.toString() || "",
      });
    } else {
      setEditingTeam(null);
      setFormData({ team_name: "", team_leader_id: "" });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTeam(null);
  };

  const openMemberModal = (team) => {
    setSelectedTeam(team);
    setIsMemberModalOpen(true);
  };

  const closeMemberModal = () => {
    setIsMemberModalOpen(false);
    setSelectedTeam(null);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.team_name.trim()) {
      errors.team_name = "Team name is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const leader = employees.find(
      (e) => e.id === parseInt(formData.team_leader_id)
    );

    if (editingTeam) {
      setTeams((prev) =>
        prev.map((t) =>
          t.id === editingTeam.id
            ? {
                ...t,
                team_name: formData.team_name,
                team_leader: leader
                  ? { id: leader.id, name: leader.name }
                  : null,
              }
            : t
        )
      );
      toast.success("Team updated successfully");
    } else {
      const newTeam = {
        id: Date.now(),
        team_name: formData.team_name,
        team_leader: leader ? { id: leader.id, name: leader.name } : null,
        members: [],
      };
      setTeams((prev) => [newTeam, ...prev]);
      toast.success("Team created successfully");
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this team?")) {
      setTeams((prev) => prev.filter((t) => t.id !== id));
      toast.success("Team deleted successfully");
    }
  };

  const addMemberToTeam = (employeeId) => {
    const employee = employees.find((e) => e.id === employeeId);
    if (!employee || !selectedTeam) return;

    const isAlreadyMember = selectedTeam.members.some(
      (m) => m.id === employeeId
    );
    if (isAlreadyMember) {
      toast.error("This person is already a team member");
      return;
    }

    setTeams((prev) =>
      prev.map((t) =>
        t.id === selectedTeam.id
          ? {
              ...t,
              members: [
                ...t.members,
                {
                  id: employee.id,
                  name: employee.name,
                  position: employee.position,
                },
              ],
            }
          : t
      )
    );
    setSelectedTeam((prev) => ({
      ...prev,
      members: [
        ...prev.members,
        { id: employee.id, name: employee.name, position: employee.position },
      ],
    }));
    toast.success("Member added to team");
  };

  const removeMemberFromTeam = (memberId) => {
    if (!selectedTeam) return;

    setTeams((prev) =>
      prev.map((t) =>
        t.id === selectedTeam.id
          ? { ...t, members: t.members.filter((m) => m.id !== memberId) }
          : t
      )
    );
    setSelectedTeam((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== memberId),
    }));
    toast.success("Member removed from team");
  };

  const getAvailableEmployees = () => {
    if (!selectedTeam) return employees;
    const memberIds = selectedTeam.members.map((m) => m.id);
    return employees.filter((e) => !memberIds.includes(e.id));
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Teams</h1>
          <p className="text-slate-500 mt-1">
            Organize and manage your maintenance teams
          </p>
        </div>
        <button onClick={() => openModal()} className="btn-primary">
          <Plus className="w-5 h-5" />
          Create Team
        </button>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-12"
          />
        </div>
      </div>

      {/* Teams Grid */}
      {filteredTeams.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No teams found"
          description={
            searchQuery
              ? "Try adjusting your search criteria"
              : "Get started by creating your first team"
          }
          action={() => openModal()}
          actionLabel="Create Team"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <div key={team.id} className="card">
              <div className="p-6">
                {/* Team Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {team.team_name}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {team.members.length} members
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openModal(team)}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary-600 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(team.id)}
                      className="p-2 rounded-lg hover:bg-danger-50 text-slate-400 hover:text-danger-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Team Leader */}
                {team.team_leader && (
                  <div className="flex items-center gap-2 p-3 bg-primary-50 rounded-xl mb-4">
                    <Crown className="w-4 h-4 text-primary-600" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-primary-700">
                        Team Leader
                      </p>
                      <p className="text-sm text-primary-600 truncate">
                        {team.team_leader.name}
                      </p>
                    </div>
                  </div>
                )}

                {/* Team Members */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Members
                  </p>
                  {team.members.length === 0 ? (
                    <p className="text-sm text-slate-400 italic">
                      No members yet
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {team.members.slice(0, 4).map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full"
                        >
                          <div className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center text-xs font-medium text-slate-600">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <span className="text-sm text-slate-700">
                            {member.name.split(" ")[0]}
                          </span>
                        </div>
                      ))}
                      {team.members.length > 4 && (
                        <div className="flex items-center justify-center w-8 h-8 bg-slate-200 rounded-full text-xs font-medium text-slate-600">
                          +{team.members.length - 4}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Team Actions */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                <button
                  onClick={() => openMemberModal(team)}
                  className="btn-ghost w-full justify-center text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                >
                  <UserPlus className="w-4 h-4" />
                  Manage Members
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Team Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingTeam ? "Edit Team" : "Create Team"}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Team Name *</label>
            <input
              type="text"
              value={formData.team_name}
              onChange={(e) =>
                setFormData({ ...formData, team_name: e.target.value })
              }
              className={`input ${formErrors.team_name ? "input-error" : ""}`}
              placeholder="Enter team name"
            />
            {formErrors.team_name && (
              <p className="mt-1.5 text-sm text-danger-600">
                {formErrors.team_name}
              </p>
            )}
          </div>

          <div>
            <label className="label">Team Leader</label>
            <select
              value={formData.team_leader_id}
              onChange={(e) =>
                setFormData({ ...formData, team_leader_id: e.target.value })
              }
              className="select"
            >
              <option value="">Select team leader</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} - {emp.position}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button type="button" onClick={closeModal} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingTeam ? "Update" : "Create"} Team
            </button>
          </div>
        </form>
      </Modal>

      {/* Manage Members Modal */}
      <Modal
        isOpen={isMemberModalOpen}
        onClose={closeMemberModal}
        title={`Manage Members - ${selectedTeam?.team_name || ""}`}
        size="lg"
      >
        <div className="space-y-6">
          {/* Current Members */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">
              Current Members ({selectedTeam?.members.length || 0})
            </h4>
            {selectedTeam?.members.length === 0 ? (
              <p className="text-sm text-slate-400 italic">
                No members in this team
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedTeam?.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-sm font-medium text-primary-600">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {member.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {member.position}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeMemberFromTeam(member.id)}
                      className="p-2 text-slate-400 hover:text-danger-500 hover:bg-danger-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Members */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">
              Add Members
            </h4>
            {getAvailableEmployees().length === 0 ? (
              <p className="text-sm text-slate-400 italic">
                All employees are already in this team
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {getAvailableEmployees().map((emp) => (
                  <div
                    key={emp.id}
                    className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-600">
                        {emp.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{emp.name}</p>
                        <p className="text-sm text-slate-500">{emp.position}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => addMemberToTeam(emp.id)}
                      className="btn-outline py-1.5 px-3 text-sm"
                    >
                      <UserPlus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200">
            <button onClick={closeMemberModal} className="btn-primary">
              Done
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Teams;
