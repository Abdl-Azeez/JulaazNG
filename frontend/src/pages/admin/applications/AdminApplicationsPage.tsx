import { useState } from 'react'
import { AdminLayout } from '@/widgets/admin-layout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  Wrench, 
  Home, 
  Search, 
  Filter, 
  ArrowUpRight, 
  MoreHorizontal,
  Calendar,
  User,
  MapPin
} from 'lucide-react'
import { cn } from '@/shared/lib/utils/cn'

// Mocks
import { mockLandlordApplications } from '@/__mocks__/data/landlord.mock'
import { mockUpcomingJobs } from '@/__mocks__/data/handyman.mock'
import { mockInspections } from '@/__mocks__/data/homerunner.mock'

export function AdminApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Filter Logic
  const filteredLandlordApplications = mockLandlordApplications.filter(app => {
    const matchesSearch = 
      app.applicant?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicant?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.property?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.landlord?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.landlord?.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || app.status.toLowerCase() === filterStatus.toLowerCase()

    return matchesSearch && matchesFilter
  })

  // Analytics for Landlord Applications
  const landlordStats = {
    total: mockLandlordApplications.length,
    pending: mockLandlordApplications.filter(a => a.status === 'pending').length,
    approved: mockLandlordApplications.filter(a => a.status === 'approved').length,
    rejected: mockLandlordApplications.filter(a => a.status === 'rejected').length,
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'confirmed':
      case 'completed':
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20">Approved</Badge>
      case 'pending':
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20">Pending</Badge>
      case 'rejected':
      case 'cancelled':
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20">Rejected</Badge>
      default:
        return <Badge variant="outline" className="capitalize">{status}</Badge>
    }
  }

  interface StatCardProps {
    title: string
    value: number | string
    icon: React.ElementType
    trend?: string
    trendUp?: boolean
    colorClass?: string
  }

  const StatCard = ({ title, value, icon: Icon, trend, trendUp, colorClass }: StatCardProps) => (
    <Card className="overflow-hidden border-none shadow-md bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={cn("p-2 rounded-full bg-background/80", colorClass)}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={cn("text-xs flex items-center mt-1", trendUp ? "text-emerald-500" : "text-red-500")}>
            {trendUp ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowUpRight className="h-3 w-3 mr-1 rotate-90" />}
            {trend}
            <span className="text-muted-foreground ml-1">vs last month</span>
          </p>
        )}
      </CardContent>
    </Card>
  )

  return (
    <AdminLayout>
      <main className="flex-1">
        <section className="border-b border-border/60 bg-gradient-to-br from-violet-500/10 via-background to-background relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
          
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-4">
                <Badge className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold border-primary/20">
                  <FileText className="h-3 w-3 mr-1" />
                  Admin Portal
                </Badge>
                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
                    Applications & Requests
                  </h1>
                  <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
                    Centralized management for tenant applications, service requests, and homerunners tasks.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" className="h-10 gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Last 30 Days</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="h-10 gap-2 shadow-lg shadow-primary/20">
                      <Filter className="h-4 w-4" />
                      <span>Filter View</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                      All Applications
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus('pending')}>
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus('approved')}>
                      Approved
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus('rejected')}>
                      Rejected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 -mt-8">
          <Tabs defaultValue="landlord" className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/50 backdrop-blur-sm p-2 rounded-2xl border shadow-sm">
              <TabsList className="h-12 bg-muted/50 p-1 gap-1 w-full sm:w-auto">
                <TabsTrigger value="landlord" className="h-10 px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
                  <FileText className="h-4 w-4 mr-2" />
                  Landlord Apps
                </TabsTrigger>
                <TabsTrigger value="services" className="h-10 px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
                  <Wrench className="h-4 w-4 mr-2" />
                  Service Requests
                </TabsTrigger>
                <TabsTrigger value="homerunner" className="h-10 px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
                  <Home className="h-4 w-4 mr-2" />
                  Homerunner Tasks
                </TabsTrigger>
              </TabsList>

              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search applications..." 
                  className="pl-9 h-10 bg-background/50 border-muted-foreground/20 focus:bg-background transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Landlord Applications Tab */}
            <TabsContent value="landlord" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard 
                  title="Total Applications" 
                  value={landlordStats.total} 
                  icon={FileText} 
                  trend="+12%" 
                  trendUp={true}
                  colorClass="text-blue-500 bg-blue-500/10"
                />
                <StatCard 
                  title="Pending Review" 
                  value={landlordStats.pending} 
                  icon={Clock} 
                  trend="+5%" 
                  trendUp={false}
                  colorClass="text-amber-500 bg-amber-500/10"
                />
                <StatCard 
                  title="Approved" 
                  value={landlordStats.approved} 
                  icon={CheckCircle2} 
                  trend="+8%" 
                  trendUp={true}
                  colorClass="text-emerald-500 bg-emerald-500/10"
                />
                <StatCard 
                  title="Rejected" 
                  value={landlordStats.rejected} 
                  icon={XCircle} 
                  trend="-2%" 
                  trendUp={true}
                  colorClass="text-red-500 bg-red-500/10"
                />
              </div>

              <Card className="border-none shadow-md overflow-hidden">
                <CardHeader className="bg-muted/30 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Applications</CardTitle>
                      <CardDescription>
                        Review and manage tenant applications for properties.
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <ArrowUpRight className="h-4 w-4" />
                      Export List
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-b border-border/60">
                        <TableHead>Applicant</TableHead>
                        <TableHead>Property</TableHead>
                        <TableHead>Landlord</TableHead>
                        <TableHead>Move-in Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLandlordApplications.map((app) => (
                        <TableRow key={app.id} className="group hover:bg-muted/30 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                                {app.applicant?.firstName?.[0]}{app.applicant?.lastName?.[0]}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-sm">{app.applicant?.firstName} {app.applicant?.lastName}</span>
                                <span className="text-xs text-muted-foreground">{app.applicant?.email}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">{app.property?.title}</span>
                              <span className="text-xs text-muted-foreground font-mono">ID: {app.propertyId}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-600 font-medium text-sm">
                                {app.landlord?.firstName?.[0]}{app.landlord?.lastName?.[0]}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-sm">{app.landlord?.firstName} {app.landlord?.lastName}</span>
                                <span className="text-xs text-muted-foreground">{app.landlord?.email}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span>{app.moveInDate}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(app.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Eye className="h-4 w-4 text-muted-foreground hover:text-primary" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Application Details</DialogTitle>
                                    <DialogDescription>
                                      Full details of the tenant application.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                                    <div className="space-y-4">
                                      <h3 className="font-semibold border-b pb-2 flex items-center gap-2">
                                        <User className="h-4 w-4" /> Tenant Information
                                      </h3>
                                      <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                                        <span className="text-muted-foreground">Name:</span>
                                        <span className="font-medium truncate" title={`${app.applicant?.firstName} ${app.applicant?.lastName}`}>
                                          {app.applicant?.firstName} {app.applicant?.lastName}
                                        </span>
                                        <span className="text-muted-foreground">Email:</span>
                                        <span className="break-all">{app.applicant?.email}</span>
                                        <span className="text-muted-foreground">Phone:</span>
                                        <span>{app.applicant?.phoneNumber}</span>
                                        <span className="text-muted-foreground">Employment:</span>
                                        <Badge variant="secondary" className="w-fit">{app.employmentStatus}</Badge>
                                        <span className="text-muted-foreground">Income:</span>
                                        <span className="text-emerald-600 font-medium">₦{app.monthlyIncome?.toLocaleString()}</span>
                                      </div>
                                    </div>
                                    <div className="space-y-4">
                                      <h3 className="font-semibold border-b pb-2 flex items-center gap-2">
                                        <User className="h-4 w-4" /> Landlord Information
                                      </h3>
                                      <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                                        <span className="text-muted-foreground">Name:</span>
                                        <span className="font-medium truncate" title={`${app.landlord?.firstName} ${app.landlord?.lastName}`}>
                                          {app.landlord?.firstName} {app.landlord?.lastName}
                                        </span>
                                        <span className="text-muted-foreground">Email:</span>
                                        <span className="break-all">{app.landlord?.email}</span>
                                        <span className="text-muted-foreground">Phone:</span>
                                        <span>{app.landlord?.phoneNumber}</span>
                                        <span className="text-muted-foreground">ID:</span>
                                        <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded w-fit">{app.landlordId}</span>
                                      </div>
                                    </div>
                                    <div className="space-y-4">
                                      <h3 className="font-semibold border-b pb-2 flex items-center gap-2">
                                        <Home className="h-4 w-4" /> Property Details
                                      </h3>
                                      <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                                        <span className="text-muted-foreground">Property:</span>
                                        <span className="font-medium truncate" title={app.property?.title}>{app.property?.title}</span>
                                        <span className="text-muted-foreground">Price:</span>
                                        <span>₦{app.property?.price.toLocaleString()}</span>
                                        <span className="text-muted-foreground">Property ID:</span>
                                        <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded w-fit">{app.propertyId}</span>
                                      </div>
                                    </div>
                                    <div className="space-y-4">
                                      <h3 className="font-semibold border-b pb-2 flex items-center gap-2">
                                        <FileText className="h-4 w-4" /> Lease Details
                                      </h3>
                                      <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="flex flex-col gap-1">
                                          <span className="text-muted-foreground text-xs">Move-in Date</span>
                                          <span className="font-medium">{app.moveInDate}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                          <span className="text-muted-foreground text-xs">Duration</span>
                                          <span className="font-medium">{app.leaseDuration} {app.leaseDurationUnit}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                          <span className="text-muted-foreground text-xs">Guarantor</span>
                                          <span className="font-medium">{app.hasGuarantor ? 'Yes' : 'No'}</span>
                                        </div>
                                      </div>
                                      {app.notes && (
                                        <div className="mt-4 bg-amber-50/50 border border-amber-100 p-3 rounded-lg">
                                          <span className="text-amber-800 text-xs font-semibold block mb-1">Notes</span>
                                          <p className="text-sm text-amber-900/80">{app.notes}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4 text-muted-foreground hover:text-primary" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                 
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>Contact Tenant</DropdownMenuItem>
                                  <DropdownMenuItem>Contact Landlord</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Service Requests Tab */}
            <TabsContent value="services" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
              <Card className="border-none shadow-md overflow-hidden">
                <CardHeader className="bg-muted/30 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Service Requests</CardTitle>
                      <CardDescription>
                        Monitor service requests between users and handymen.
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="h-8">
                      Export CSV
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead>Service</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Scheduled For</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockUpcomingJobs.map((job) => (
                        <TableRow key={job.id} className="group hover:bg-muted/30 transition-colors">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <Wrench className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="font-medium">{job.title}</div>
                                <div className="text-xs text-muted-foreground font-mono">ID: {job.id}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">{job.client}</span>
                              <span className="text-xs text-muted-foreground">{job.contact}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate max-w-[150px]">{job.location}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span>{job.scheduledFor}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(job.status)}</TableCell>
                          <TableCell className="text-right">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Service Request Details</DialogTitle>
                                  <DialogDescription>ID: {job.id}</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <span className="font-semibold">Service:</span>
                                    <span>{job.title}</span>
                                    <span className="font-semibold">Client:</span>
                                    <span>{job.client}</span>
                                    <span className="font-semibold">Contact:</span>
                                    <span>{job.contact}</span>
                                    <span className="font-semibold">Location:</span>
                                    <span>{job.location}</span>
                                    <span className="font-semibold">Scheduled:</span>
                                    <span>{job.scheduledFor}</span>
                                    <span className="font-semibold">Status:</span>
                                    <span>{job.status}</span>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Homerunner Tasks Tab */}
            <TabsContent value="homerunner" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
              <Card className="border-none shadow-md overflow-hidden">
                <CardHeader className="bg-muted/30 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Homerunner Tasks</CardTitle>
                      <CardDescription>
                        Track inspections and viewings assigned to homerunners.
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="h-8">
                      Export CSV
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead>Property</TableHead>
                        <TableHead>Landlord</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Scheduled For</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockInspections.map((task) => (
                        <TableRow key={task.id} className="group hover:bg-muted/30 transition-colors">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <Home className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="font-medium">{task.propertyTitle}</div>
                                <div className="text-xs text-muted-foreground font-mono">ID: {task.propertyId}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">{task.landlordName}</span>
                              <span className="text-xs text-muted-foreground">{task.landlordPhone}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate max-w-[150px]">{task.location}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span>{task.scheduledFor}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(task.status)}</TableCell>
                          <TableCell className="text-right">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Inspection Details</DialogTitle>
                                  <DialogDescription>ID: {task.id}</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <span className="font-semibold">Property:</span>
                                    <span>{task.propertyTitle}</span>
                                    <span className="font-semibold">Landlord:</span>
                                    <span>{task.landlordName}</span>
                                    <span className="font-semibold">Landlord Phone:</span>
                                    <span>{task.landlordPhone}</span>
                                    <span className="font-semibold">Location:</span>
                                    <span>{task.location}</span>
                                    <span className="font-semibold">Scheduled:</span>
                                    <span>{task.scheduledFor}</span>
                                    <span className="font-semibold">Type:</span>
                                    <span className="capitalize">{task.type.replace('_', ' ')}</span>
                                    <span className="font-semibold">Status:</span>
                                    <span>{task.status}</span>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </AdminLayout>
  )
}
