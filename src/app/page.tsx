"use client";

import React, { useEffect, useState } from "react";
import { Edit, Eye, MoreVertical, Plus, Trash2 } from "lucide-react";

// ========== TYPES ==========
interface Tenant {
  id: number;
  name: string;
  roomNumber: string;
  building: string;
  gender: string;
  leaseStart: string;
  leaseEnd: string;
  rentStatus: "paid" | "pending";
  image: string;
  email: string;
  phone: string;
}

interface Building {
  id: number;
  name: string;
  totalRooms: number;
  occupiedRooms: number;
}

// ========== COMPONENTS ==========
const Button = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
    {...props}
  >
    {children}
  </button>
);

const Input = ({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    {...props}
  />
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-sm font-medium text-gray-700 mb-1">{children}</label>
);

const Badge = ({
                 variant = 'default',
                 children
               }: {
  variant?: 'default' | 'success' | 'warning';
  children: React.ReactNode
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

const Table = ({ children }: { children: React.ReactNode }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">{children}</table>
  </div>
);

const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-gray-50">{children}</thead>
);

const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
);

const TableRow = ({ children }: { children: React.ReactNode }) => (
  <tr>{children}</tr>
);

const TableHead = ({ children }: { children: React.ReactNode }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>
);

const TableCell = ({ children }: { children: React.ReactNode }) => (
  <td className="px-6 py-4 whitespace-nowrap">{children}</td>
);

const Dialog = ({
                  open,
                  onOpenChange,
                  children
                }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={() => onOpenChange(false)}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

const DialogContent = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
    {children}
  </div>
);

const DialogHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4">{children}</div>
);

const DialogTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-lg leading-6 font-medium text-gray-900">{children}</h3>
);

const DialogDescription = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm text-gray-500">{children}</p>
);

const DialogFooter = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
    {children}
  </div>
);

const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === DropdownMenuTrigger) {
            return React.cloneElement(child, { onClick: () => setOpen(!open) });
          }
          if (child.type === DropdownMenuContent && open) {
            return child;
          }
        }
        return null;
      })}
    </div>
  );
};

const DropdownMenuTrigger = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props}>{children}</button>
);

const DropdownMenuContent = ({ children }: { children: React.ReactNode }) => (
  <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
    <div className="py-1">{children}</div>
  </div>
);

const DropdownMenuItem = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" {...props}>
    {children}
  </button>
);

const Select = ({
                  value,
                  onValueChange,
                  children
                }: {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="w-full p-2 border border-gray-300 rounded text-left"
        onClick={() => setOpen(!open)}
      >
        {React.Children.toArray(children).find(
          (child: any) => child.props.value === value
        )?.props?.children || 'Select...'}
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded border border-gray-200">
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                onClick: () => {
                  onValueChange(child.props.value);
                  setOpen(false);
                }
              } as React.Attributes & { onClick?: () => void });
            }
            return child;
          })}
        </div>
      )}
    </div>
  );
};

const SelectItem = ({
                      value,
                      children,
                      onClick
                    }: {
  value: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <button
    className="w-full text-left px-4 py-2 hover:bg-gray-100"
    onClick={onClick}
  >
    {children}
  </button>
);

// ========== MAIN COMPONENT ==========
const Dashboard = () => {
  const [tenants, setTenants] = useState<Tenant[]>([
    {
      id: 1,
      name: "John Doe",
      roomNumber: "101",
      building: "A",
      gender: "male",
      leaseStart: "2023-01-01",
      leaseEnd: "2023-12-31",
      rentStatus: "paid",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      email: "john@example.com",
      phone: "+1234567890"
    },
    // Add more tenants as needed
  ]);

  const [buildings] = useState<Building[]>([
    { id: 1, name: "A", totalRooms: 50, occupiedRooms: 45 },
    { id: 2, name: "B", totalRooms: 50, occupiedRooms: 42 }
  ]);

  const [filteredTenants, setFilteredTenants] = useState<Tenant[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [rentStatusFilter, setRentStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [tenantsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteTenantId, setDeleteTenantId] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    setFilteredTenants(tenants);
  }, [tenants]);

  useEffect(() => {
    let result = [...tenants];

    if (selectedBuilding !== "all") {
      result = result.filter(t => t.building === selectedBuilding);
    }

    if (selectedGender !== "all") {
      result = result.filter(t => t.gender === selectedGender);
    }

    if (rentStatusFilter !== "all") {
      result = result.filter(t => t.rentStatus === rentStatusFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(t =>
        t.name.toLowerCase().includes(term) ||
        t.roomNumber.toLowerCase().includes(term)
      );
    }

    setFilteredTenants(result);
    setCurrentPage(1);
  }, [selectedBuilding, selectedGender, rentStatusFilter, searchTerm, tenants]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteTenant = (id: number) => {
    setTenants(tenants.filter(t => t.id !== id));
    setIsDeleteDialogOpen(false);
  };

  const handleAddTenant = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const newTenant: Tenant = {
      id: tenants.length + 1,
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      roomNumber: (form.elements.namedItem('roomNumber') as HTMLInputElement).value,
      building: (form.elements.namedItem('building') as HTMLInputElement).value,
      gender: (form.elements.namedItem('gender') as HTMLInputElement).value,
      leaseStart: (form.elements.namedItem('leaseStart') as HTMLInputElement).value,
      leaseEnd: (form.elements.namedItem('leaseEnd') as HTMLInputElement).value,
      rentStatus: (form.elements.namedItem('rentStatus') as HTMLInputElement).value as "paid" | "pending",
      image: imagePreview || "https://randomuser.me/api/portraits/men/1.jpg",
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
    };
    setTenants([...tenants, newTenant]);
    setIsTenantModalOpen(false);
    setImagePreview("");
  };

  const paginatedTenants = filteredTenants.slice(
    (currentPage - 1) * tenantsPerPage,
    currentPage * tenantsPerPage
  );

  const totalPages = Math.ceil(filteredTenants.length / tenantsPerPage);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Tenant Management</h1>
          <Button onClick={() => setIsTenantModalOpen(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Add Tenant
          </Button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Building</Label>
              <Select
                value={selectedBuilding}
                onValueChange={setSelectedBuilding}
              >
                <SelectItem value="all">All Buildings</SelectItem>
                {buildings.map(b => (
                  <SelectItem key={b.id} value={b.name}>
                    Building {b.name}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div>
              <Label>Gender</Label>
              <Select
                value={selectedGender}
                onValueChange={setSelectedGender}
              >
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </Select>
            </div>

            <div>
              <Label>Rent Status</Label>
              <Select
                value={rentStatusFilter}
                onValueChange={setRentStatusFilter}
              >
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </Select>
            </div>

            <div>
              <Label>Search</Label>
              <Input
                placeholder="Search tenants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Tenants Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Building</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Lease Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTenants.map(tenant => (
                <TableRow key={tenant.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <img
                        src={tenant.image}
                        alt={tenant.name}
                        className="h-10 w-10 rounded-full mr-3"
                      />
                      <div>
                        <div className="font-medium">{tenant.name}</div>
                        <div className="text-gray-500">{tenant.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{tenant.roomNumber}</TableCell>
                  <TableCell>{tenant.building}</TableCell>
                  <TableCell>
                    <Badge variant={tenant.gender === 'male' ? 'default' : 'warning'}>
                      {tenant.gender}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {tenant.leaseStart} - {tenant.leaseEnd}
                  </TableCell>
                  <TableCell>
                    <Badge variant={tenant.rentStatus === 'paid' ? 'success' : 'warning'}>
                      {tenant.rentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setDeleteTenantId(tenant.id);
                          setIsDeleteDialogOpen(true);
                        }}>
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div>
            Showing {paginatedTenants.length} of {filteredTenants.length} tenants
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </main>

      {/* Add Tenant Modal */}
      <Dialog open={isTenantModalOpen} onOpenChange={setIsTenantModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Tenant</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new tenant to the system.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddTenant}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label>Name</Label>
                <Input name="name" required />
              </div>
              <div>
                <Label>Room Number</Label>
                <Input name="roomNumber" required />
              </div>
              <div>
                <Label>Building</Label>
                <Select
                  name="building"
                  value=""
                  onValueChange={() => {}}
                >
                  {buildings.map(b => (
                    <SelectItem key={b.id} value={b.name}>
                      Building {b.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div>
                <Label>Gender</Label>
                <Select
                  name="gender"
                  value=""
                  onValueChange={() => {}}
                >
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </Select>
              </div>
              <div>
                <Label>Lease Start</Label>
                <Input name="leaseStart" type="date" required />
              </div>
              <div>
                <Label>Lease End</Label>
                <Input name="leaseEnd" type="date" required />
              </div>
              <div>
                <Label>Rent Status</Label>
                <Select
                  name="rentStatus"
                  value=""
                  onValueChange={() => {}}
                >
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </Select>
              </div>
              <div>
                <Label>Email</Label>
                <Input name="email" type="email" required />
              </div>
              <div>
                <Label>Phone</Label>
                <Input name="phone" type="tel" required />
              </div>
              <div>
                <Label>Profile Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>
            {imagePreview && (
              <div className="mb-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 w-32 rounded-full object-cover"
                />
              </div>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsTenantModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Tenant</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tenant</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this tenant? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (deleteTenantId) {
                  handleDeleteTenant(deleteTenantId);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
