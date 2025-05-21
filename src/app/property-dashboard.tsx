"use client";
import { useState } from "react";
import {
  FiCalendar,
  FiCompass,
  FiDollarSign,
  FiHome,
  FiMapPin,
  FiMenu,
  FiPlusCircle,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { Poppins } from "next/font/google";

// Set up Poppins font
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

type Property = {
  id: number;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  agent: string;
  image: string;
  status: "featured" | "new" | "sold" | "pending";
  location: string;
  propertyType: "apartment" | "house" | "office" | "land";
  amenities: string[];
  listedDate: string;
  soldDate?: string;
  commission: number;
};

type Agent = {
  id: number;
  name: string;
  image: string;
  properties: number;
  sales: number;
  closedDeals: number;
  phone: string;
  email: string;
  joinDate: string;
};

type Activity = {
  id: number;
  title: string;
  date: string;
  time: string;
  type: "viewing" | "meeting" | "open house" | "closing";
  location: string;
  client: string;
  agent: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
};

type FinancialRecord = {
  id: number;
  type: "commission" | "expense" | "bonus";
  amount: number;
  date: string;
  propertyId?: number;
  description: string;
  agent: string;
};

export default function RealEstateDashboard() {
  const [activeTab, setActiveTab] = useState<
    "properties" | "agents" | "activities" | "finances"
  >("properties");
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );
  const [, setActiveAgent] = useState<Agent | null>(null);
  const [, setActiveActivity] = useState<Activity | null>(null);
  const [searchQuery] = useState("");

  const [showAddProperty, setShowAddProperty] = useState(false);
  const [showAddAgent, setShowAddAgent] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [showAddRecord, setShowAddRecord] = useState(false);

  const [newProperty, setNewProperty] = useState<Omit<Property, "id">>({
    title: "",
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    agent: "",
    image: "",
    status: "new",
    location: "",
    propertyType: "apartment",
    amenities: [],
    listedDate: new Date().toISOString().split("T")[0],
    commission: 0,
  });

  const [newAgent, setNewAgent] = useState<Omit<Agent, "id">>({
    name: "",
    image: "",
    properties: 0,
    sales: 0,
    closedDeals: 0,
    phone: "",
    email: "",
    joinDate: new Date().toISOString().split("T")[0],
  });

  const [newActivity, setNewActivity] = useState<Omit<Activity, "id">>({
    title: "",
    date: new Date().toISOString().split("T")[0],
    time: "",
    type: "viewing",
    location: "",
    client: "",
    agent: "",
    status: "scheduled",
    notes: "",
  });

  const [newRecord, setNewRecord] = useState<Omit<FinancialRecord, "id">>({
    type: "commission",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    description: "",
    agent: "",
    propertyId: undefined,
  });

  const [properties, setProperties] = useState<Property[]>([
    {
      id: 1,
      title: "Luxury Apartment in Downtown",
      price: 525000,
      bedrooms: 3,
      bathrooms: 2,
      area: 1500,
      agent: "Sarah Johnson",
      image: "https://i.postimg.cc/Xv2rS2CZ/large-home-389271-640.jpg",
      status: "sold",
      location: "Downtown Manhattan, New York",
      propertyType: "apartment",
      amenities: ["Swimming Pool", "Gym", "Parking"],
      listedDate: "2025-01-15",
      soldDate: "2025-03-20",
      commission: 15750,
    },
    {
      id: 2,
      title: "Modern Family House",
      price: 750000,
      bedrooms: 4,
      bathrooms: 3,
      area: 2200,
      agent: "Michael Chen",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600&h=400",
      status: "pending",
      location: "Greenwood, Seattle",
      propertyType: "house",
      amenities: ["Backyard", "Garage", "Fireplace"],
      listedDate: "2025-02-10",
      commission: 22500,
    },
    {
      id: 3,
      title: "Commercial Office Space",
      price: 1200000,
      bedrooms: 0,
      bathrooms: 2,
      area: 3500,
      agent: "Sarah Johnson",
      image:
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600&h=400",
      status: "featured",
      location: "Financial District, San Francisco",
      propertyType: "office",
      amenities: ["Conference Rooms", "Reception", "Security"],
      listedDate: "2025-03-01",
      commission: 36000,
    },
    {
      id: 4,
      title: "Vacant Land for Development",
      price: 320000,
      bedrooms: 0,
      bathrooms: 0,
      area: 5000,
      agent: "David Wilson",
      image:
        "https://images.unsplash.com/photo-1500380804539-4e1e8c1e7118?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600&h=400",
      status: "new",
      location: "Outskirts, Austin",
      propertyType: "land",
      amenities: ["Water Access", "Zoned Residential"],
      listedDate: "2025-04-15",
      commission: 9600,
    },
  ]);

  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 1,
      name: "Sarah Johnson",
      image:
        "https://images.unsplash.com/photo-1598550880863-4e8aa3d0edb4?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600&h=600",
      properties: 12,
      sales: 6200000,
      closedDeals: 8,
      phone: "(555) 123-4567",
      email: "sarah@realtypro.com",
      joinDate: "2023-01-15",
    },
    {
      id: 2,
      name: "Michael Chen",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600&h=600",
      properties: 8,
      sales: 4500000,
      closedDeals: 5,
      phone: "(555) 987-6543",
      email: "michael@realtypro.com",
      joinDate: "2023-05-20",
    },
    {
      id: 3,
      name: "David Wilson",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600&h=600",
      properties: 15,
      sales: 7800000,
      closedDeals: 11,
      phone: "(555) 456-7890",
      email: "david@realtypro.com",
      joinDate: "2022-11-10",
    },
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 1,
      title: "Viewing at Luxury Apartment",
      date: "2025-03-10",
      time: "10:00 AM",
      type: "viewing",
      location: "Downtown Manhattan, New York",
      client: "John Doe",
      agent: "Sarah Johnson",
      status: "completed",
      notes: "Client very interested, considering offer",
    },
    {
      id: 2,
      title: "Closing for Modern Family House",
      date: "2025-04-05",
      time: "2:00 PM",
      type: "closing",
      location: "Greenwood, Seattle",
      client: "Emily Rodriguez",
      agent: "Michael Chen",
      status: "scheduled",
    },
    {
      id: 3,
      title: "Open House Event",
      date: "2025-04-12",
      time: "11:00 AM - 3:00 PM",
      type: "open house",
      location: "Financial District, San Francisco",
      client: "Public",
      agent: "Sarah Johnson",
      status: "scheduled",
    },
    {
      id: 4,
      title: "Client Meeting",
      date: "2025-04-08",
      time: "9:30 AM",
      type: "meeting",
      location: "Office",
      client: "Robert Smith",
      agent: "David Wilson",
      status: "scheduled",
    },
  ]);

  const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>([
    {
      id: 1,
      type: "commission",
      amount: 15750,
      date: "2025-03-25",
      propertyId: 1,
      description: "Luxury Apartment sale",
      agent: "Sarah Johnson",
    },
    {
      id: 2,
      type: "expense",
      amount: 1200,
      date: "2025-03-28",
      description: "Marketing materials",
      agent: "All",
    },
    {
      id: 3,
      type: "commission",
      amount: 22500,
      date: "2025-04-10",
      propertyId: 2,
      description: "Modern Family House (pending)",
      agent: "Michael Chen",
    },
    {
      id: 4,
      type: "bonus",
      amount: 5000,
      date: "2025-03-15",
      description: "Q1 Performance Bonus",
      agent: "Sarah Johnson",
    },
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "featured":
        return "bg-yellow-100 text-yellow-800";
      case "new":
        return "bg-green-100 text-green-800";
      case "sold":
        return "bg-purple-100 text-purple-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredProperties = properties.filter((property) =>
    property.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const soldProperties = properties.filter(
    (property) => property.status === "sold",
  );
  const pendingProperties = properties.filter(
    (property) => property.status === "pending",
  );
  const activeProperties = properties.filter(
    (property) => property.status === "featured" || property.status === "new",
  );

  const totalSales = soldProperties.reduce(
    (sum, property) => sum + property.price,
    0,
  );
  const totalCommission = financialRecords
    .filter((record) => record.type === "commission")
    .reduce((sum, record) => sum + record.amount, 0);
  const totalExpenses = financialRecords
    .filter((record) => record.type === "expense")
    .reduce((sum, record) => sum + record.amount, 0);
  const netRevenue = totalCommission - totalExpenses;

  const handleAddProperty = () => {
    const newId = Math.max(...properties.map((p) => p.id), 0) + 1;
    setProperties([...properties, { ...newProperty, id: newId }]);
    setShowAddProperty(false);
    setNewProperty({
      title: "",
      price: 0,
      bedrooms: 0,
      bathrooms: 0,
      area: 0,
      agent: "",
      image: "",
      status: "new",
      location: "",
      propertyType: "apartment",
      amenities: [],
      listedDate: new Date().toISOString().split("T")[0],
      commission: 0,
    });
  };

  const handleAddAgent = () => {
    const newId = Math.max(...agents.map((a) => a.id), 0) + 1;
    setAgents([...agents, { ...newAgent, id: newId }]);
    setShowAddAgent(false);
    setNewAgent({
      name: "",
      image: "",
      properties: 0,
      sales: 0,
      closedDeals: 0,
      phone: "",
      email: "",
      joinDate: new Date().toISOString().split("T")[0],
    });
  };

  const handleAddActivity = () => {
    const newId = Math.max(...activities.map((a) => a.id), 0) + 1;
    setActivities([...activities, { ...newActivity, id: newId }]);
    setShowAddActivity(false);
    setNewActivity({
      title: "",
      date: new Date().toISOString().split("T")[0],
      time: "",
      type: "viewing",
      location: "",
      client: "",
      agent: "",
      status: "scheduled",
      notes: "",
    });
  };

  const handleAddRecord = () => {
    const newId = Math.max(...financialRecords.map((r) => r.id), 0) + 1;
    setFinancialRecords([...financialRecords, { ...newRecord, id: newId }]);
    setShowAddRecord(false);
    setNewRecord({
      type: "commission",
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      description: "",
      agent: "",
      propertyId: undefined,
    });
  };

  const renderPropertyCard = (property: Property) => (
    <div
      key={property.id}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer text-gray-900"
      onClick={() => setSelectedProperty(property)}
    >
      <div className="relative">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <span
          className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(
            property.status,
          )}`}
        >
          {property.status}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-2">
          {property.title}
        </h3>

        <p className="text-indigo-600 font-semibold text-xl mb-3">
          {formatCurrency(property.price)}
        </p>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <FiMapPin size={14} />
          <span>{property.location}</span>
        </div>

        <div className="flex gap-4 text-sm text-gray-700 mb-3">
          <span>{property.bedrooms} Beds</span>
          <span>{property.bathrooms} Baths</span>
          <span>{property.area} sqft</span>
        </div>

        <div className="mt-3 p-3 bg-gray-50 rounded text-sm space-y-1 text-gray-600">
          <p>
            <span className="font-medium text-gray-800">Agent:</span>{" "}
            {property.agent}
          </p>
          <p>
            <span className="font-medium text-gray-800">Listed:</span>{" "}
            {formatDate(property.listedDate)}
          </p>
          {property.soldDate && (
            <p>
              <span className="font-medium text-gray-800">Sold:</span>{" "}
              {formatDate(property.soldDate)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
  const renderAgentCard = (agent: Agent) => (
    <div
      key={agent.id}
      className="bg-white rounded-lg shadow-md overflow-hidden p-4 flex gap-4 hover:shadow-lg transition-shadow cursor-pointer text-gray-900"
      onClick={() => setActiveAgent(agent)}
    >
      <img
        src={agent.image}
        alt={agent.name}
        className="w-16 h-16 rounded-full object-cover"
      />
      <div className="flex-1">
        <h3 className="font-bold">{agent.name}</h3>
        <p className="text-sm text-gray-600">
          {agent.properties} Properties | {agent.closedDeals} Closed Deals
        </p>
        <p className="text-sm font-semibold mt-1">
          Sales: {formatCurrency(agent.sales)}
        </p>
        <div className="mt-2 flex gap-2 text-xs">
          <a
            href={`tel:${agent.phone}`}
            className="text-indigo-600 hover:underline"
          >
            {agent.phone}
          </a>
          <a
            href={`mailto:${agent.email}`}
            className="text-indigo-600 hover:underline"
          >
            {agent.email}
          </a>
        </div>
      </div>
    </div>
  );

  const renderActivityCard = (activity: Activity) => (
    <div
      key={activity.id}
      className="bg-white rounded-lg shadow-md overflow-hidden p-4 hover:shadow-lg transition-shadow cursor-pointer text-gray-900"
      onClick={() => setActiveActivity(activity)}
    >
      <div className="flex justify-between">
        <h3 className="font-bold">{activity.title}</h3>
        <span
          className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(
            activity.status,
          )}`}
        >
          {activity.status}
        </span>
      </div>
      <p className="text-sm text-gray-600 mt-1">
        {activity.date} at {activity.time}
      </p>
      <div className="mt-2 text-sm">
        <p>Client: {activity.client}</p>
        <p>Agent: {activity.agent}</p>
        <p>Location: {activity.location}</p>
      </div>
      {activity.notes && (
        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
          <p className="font-medium">Notes:</p>
          <p>{activity.notes}</p>
        </div>
      )}
    </div>
  );

  const renderFinancialRecord = (record: FinancialRecord) => (
    <div
      key={record.id}
      className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-indigo-500 text-gray-900"
    >
      <div className="flex justify-between">
        <div>
          <h3 className="font-medium">
            {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
          </h3>
          <p className="text-sm text-gray-600">{record.description}</p>
          {record.propertyId && (
            <p className="text-xs mt-1">Property ID: {record.propertyId}</p>
          )}
        </div>
        <div className="text-right">
          <p
            className={`font-semibold ${
              record.type === "expense" ? "text-red-600" : "text-green-600"
            }`}
          >
            {formatCurrency(record.amount)}
          </p>
          <p className="text-xs text-gray-500">{formatDate(record.date)}</p>
          <p className="text-xs mt-1">{record.agent}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`${poppins.className} flex min-h-screen bg-gray-100`}>
      <aside
        className={`bg-gradient-to-b from-indigo-600 via-blue-500 to-indigo-700 bg-opacity-90 backdrop-blur-sm text-white-900 w-64 fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out shadow-xl
  ${showSidebar ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="p-4 border-b border-indigo-500 flex items-center space-x-3">
          <FiCompass className="text-white text-2xl" />
          <h1 className="text-2xl font-semibold tracking-wide text-white">
            RealtyPro
          </h1>
        </div>

        <nav className="mt-6 px-2 flex flex-col gap-1">
          {(["properties", "agents", "activities", "finances"] as const).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setShowSidebar(false);
                }}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors font-semibold text-white
        ${activeTab === tab ? "bg-white/20" : "hover:bg-white/10 text-white"}`}
              >
                {tab === "properties" && <FiHome className="mr-3 text-white" />}
                {tab === "agents" && <FiUsers className="mr-3 text-white" />}
                {tab === "activities" && (
                  <FiCalendar className="mr-3 text-white" />
                )}
                {tab === "finances" && (
                  <FiDollarSign className="mr-3 text-white" />
                )}
                <span className="capitalize">{tab}</span>
              </button>
            ),
          )}
        </nav>
      </aside>

      <div className="flex-1 lg:ml-64">
        <header
          className="bg-white p-4 flex items-center justify-between text-gray-900"
          style={{ boxShadow: "0 3px 3px rgba(99, 102, 241, 0.3)" }}
        >
          <div className="flex items-center">
            <button
              className="lg:hidden text-gray-700"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <FiMenu size={24} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-1 rounded-md hover:bg-indigo-100 transition-colors"
            >
              <FiCompass size={26} className="text-indigo-800" />
            </button>
          </div>
        </header>

        <main className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 text-gray-900">
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-indigo-500">
              <h3 className="text-indigo-700 text-sm">Active Properties</h3>
              <p className="text-2xl font-bold">{activeProperties.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
              <h3 className="text-green-700 text-sm">Pending Deals</h3>
              <p className="text-2xl font-bold">{pendingProperties.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
              <h3 className="text-purple-700 text-sm">Total Sales</h3>
              <p className="text-2xl font-bold">{formatCurrency(totalSales)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
              <h3 className="text-blue-700 text-sm">Net Revenue</h3>
              <p className="text-2xl font-bold">{formatCurrency(netRevenue)}</p>
            </div>
          </div>

          {activeTab === "properties" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Property Listings
                </h3>
                <div className="flex gap-2">
                  <button
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
                    onClick={() => setShowAddProperty(true)}
                  >
                    <FiPlusCircle />
                    Add Property
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProperties.map(renderPropertyCard)}
              </div>
            </div>
          )}

          {activeTab === "agents" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Agents</h3>
                <button
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
                  onClick={() => setShowAddAgent(true)}
                >
                  <FiPlusCircle />
                  Add Agent
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {agents.map(renderAgentCard)}
              </div>
            </div>
          )}

          {activeTab === "activities" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Activities
                </h3>
                <div className="flex gap-2">
                  <button
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
                    onClick={() => setShowAddActivity(true)}
                  >
                    <FiPlusCircle />
                    Add Activity
                  </button>
                  <button className="p-2 rounded bg-gray-100">
                    <FiCalendar />
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                {activities.map(renderActivityCard)}
              </div>
            </div>
          )}

          {activeTab === "finances" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Financial Records
                </h3>
                <button
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
                  onClick={() => setShowAddRecord(true)}
                >
                  <FiPlusCircle />
                  Add Record
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="text-gray-500 text-sm">Total Commission</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalCommission)}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="text-gray-500 text-sm">Total Expenses</h4>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(totalExpenses)}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="text-gray-500 text-sm">Net Revenue</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(netRevenue)}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {financialRecords
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime(),
                  )
                  .map(renderFinancialRecord)}
              </div>
            </div>
          )}
        </main>
      </div>

      {selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 text-gray-900">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{selectedProperty.title}</h3>
              <button onClick={() => setSelectedProperty(null)}>
                <FiX />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img
                  src={selectedProperty.image}
                  alt={selectedProperty.title}
                  className="w-full h-64 object-cover rounded mb-4"
                />
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Property Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Price</p>
                      <p className="font-medium">
                        {formatCurrency(selectedProperty.price)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Status</p>
                      <p className="font-medium capitalize">
                        {selectedProperty.status}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Bedrooms</p>
                      <p>{selectedProperty.bedrooms}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Bathrooms</p>
                      <p>{selectedProperty.bathrooms}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Area</p>
                      <p>{selectedProperty.area} sqft</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Type</p>
                      <p className="capitalize">
                        {selectedProperty.propertyType}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Location</h4>
                  <p className="text-gray-600">{selectedProperty.location}</p>
                </div>
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Agent</h4>
                  <p>{selectedProperty.agent}</p>
                </div>
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Dates</h4>
                  <p>Listed: {formatDate(selectedProperty.listedDate)}</p>
                  {selectedProperty.soldDate && (
                    <p>Sold: {formatDate(selectedProperty.soldDate)}</p>
                  )}
                </div>
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Commission</h4>
                  <p>{formatCurrency(selectedProperty.commission)}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProperty.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto p-6 text-gray-900">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Add New Property
              </h3>
              <button onClick={() => setShowAddProperty(false)}>
                <FiX />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newProperty.title}
                  onChange={(e) =>
                    setNewProperty({ ...newProperty, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newProperty.price || ""}
                  onChange={(e) =>
                    setNewProperty({
                      ...newProperty,
                      price: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newProperty.bedrooms || ""}
                    onChange={(e) =>
                      setNewProperty({
                        ...newProperty,
                        bedrooms: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newProperty.bathrooms || ""}
                    onChange={(e) =>
                      setNewProperty({
                        ...newProperty,
                        bathrooms: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area (sqft)
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newProperty.area || ""}
                    onChange={(e) =>
                      setNewProperty({
                        ...newProperty,
                        area: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newProperty.location}
                  onChange={(e) =>
                    setNewProperty({ ...newProperty, location: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type
                </label>
                <select
                  className="w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newProperty.propertyType}
                  onChange={(e) =>
                    setNewProperty({
                      ...newProperty,
                      propertyType: e.target.value as never,
                    })
                  }
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="office">Office</option>
                  <option value="land">Land</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newProperty.status}
                  onChange={(e) =>
                    setNewProperty({
                      ...newProperty,
                      status: e.target.value as any,
                    })
                  }
                >
                  <option value="featured">Featured</option>
                  <option value="new">New</option>
                  <option value="pending">Pending</option>
                  <option value="sold">Sold</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agent
                </label>
                <select
                  className="w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newProperty.agent}
                  onChange={(e) =>
                    setNewProperty({ ...newProperty, agent: e.target.value })
                  }
                >
                  <option value="">Select Agent</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.name}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newProperty.image}
                  onChange={(e) =>
                    setNewProperty({ ...newProperty, image: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amenities (comma separated)
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newProperty.amenities.join(",")}
                  onChange={(e) =>
                    setNewProperty({
                      ...newProperty,
                      amenities: e.target.value
                        .split(",")
                        .map((item) => item.trim()),
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commission
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newProperty.commission || ""}
                  onChange={(e) =>
                    setNewProperty({
                      ...newProperty,
                      commission: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  className="px-4 py-2 border rounded-lg text-gray-900"
                  onClick={() => setShowAddProperty(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  onClick={handleAddProperty}
                >
                  Add Property
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto p-6 text-gray-900">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">Add New Agent</h3>
              <button onClick={() => setShowAddAgent(false)}>
                <FiX />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newAgent.name}
                  onChange={(e) =>
                    setNewAgent({ ...newAgent, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newAgent.email}
                  onChange={(e) =>
                    setNewAgent({ ...newAgent, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  className="w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newAgent.phone}
                  onChange={(e) =>
                    setNewAgent({ ...newAgent, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newAgent.image}
                  onChange={(e) =>
                    setNewAgent({ ...newAgent, image: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Properties
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newAgent.properties || ""}
                    onChange={(e) =>
                      setNewAgent({
                        ...newAgent,
                        properties: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sales
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newAgent.sales || ""}
                    onChange={(e) =>
                      setNewAgent({
                        ...newAgent,
                        sales: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Closed Deals
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newAgent.closedDeals || ""}
                    onChange={(e) =>
                      setNewAgent({
                        ...newAgent,
                        closedDeals: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  className="px-4 py-2 border rounded-lg text-gray-900"
                  onClick={() => setShowAddAgent(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  onClick={handleAddAgent}
                >
                  Add Agent
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto p-6 text-gray-900">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Add New Activity
              </h3>
              <button onClick={() => setShowAddActivity(false)}>
                <FiX />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newActivity.title}
                  onChange={(e) =>
                    setNewActivity({ ...newActivity, title: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newActivity.date}
                    onChange={(e) =>
                      setNewActivity({ ...newActivity, date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    className="w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newActivity.time}
                    onChange={(e) =>
                      setNewActivity({ ...newActivity, time: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  className="w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newActivity.type}
                  onChange={(e) =>
                    setNewActivity({
                      ...newActivity,
                      type: e.target.value as any,
                    })
                  }
                >
                  <option value="viewing">Viewing</option>
                  <option value="meeting">Meeting</option>
                  <option value="open house">Open House</option>
                  <option value="closing">Closing</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newActivity.location}
                  onChange={(e) =>
                    setNewActivity({ ...newActivity, location: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newActivity.client}
                  onChange={(e) =>
                    setNewActivity({ ...newActivity, client: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agent
                </label>
                <select
                  className="w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newActivity.agent}
                  onChange={(e) =>
                    setNewActivity({ ...newActivity, agent: e.target.value })
                  }
                >
                  <option value="">Select Agent</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.name}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newActivity.status}
                  onChange={(e) =>
                    setNewActivity({
                      ...newActivity,
                      status: e.target.value as any,
                    })
                  }
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  className="w-full p-2 border rounded-lg"
                  rows={3}
                  value={newActivity.notes}
                  onChange={(e) =>
                    setNewActivity({ ...newActivity, notes: e.target.value })
                  }
                ></textarea>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  className="px-4 py-2 border rounded-lg text-gray-900"
                  onClick={() => setShowAddActivity(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  onClick={handleAddActivity}
                >
                  Add Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto p-6 text-gray-900">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Add Financial Record
              </h3>
              <button onClick={() => setShowAddRecord(false)}>
                <FiX />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  className="w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newRecord.type}
                  onChange={(e) =>
                    setNewRecord({
                      ...newRecord,
                      type: e.target.value as any,
                    })
                  }
                >
                  <option value="commission">Commission</option>
                  <option value="expense">Expense</option>
                  <option value="bonus">Bonus</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newRecord.amount || ""}
                  onChange={(e) =>
                    setNewRecord({
                      ...newRecord,
                      amount: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newRecord.date}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, date: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newRecord.description}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, description: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agent
                </label>
                <select
                  className="w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newRecord.agent}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, agent: e.target.value })
                  }
                >
                  <option value="">Select Agent</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.name}>
                      {agent.name}
                    </option>
                  ))}
                  <option value="All">All</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property ID (optional)
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newRecord.propertyId || ""}
                  onChange={(e) =>
                    setNewRecord({
                      ...newRecord,
                      propertyId: parseInt(e.target.value) || undefined,
                    })
                  }
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  className="px-4 py-2 border rounded-lg text-gray-900"
                  onClick={() => setShowAddRecord(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  onClick={handleAddRecord}
                >
                  Add Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
