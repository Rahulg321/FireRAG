"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Trash2,
  Edit,
  RefreshCw,
  FileText,
  Link,
  FileArchive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Mock data for bots and documents
const mockBots = [
  { id: "1", name: "Raun", documentCount: 5 },
  { id: "2", name: "Customer Support Bot", documentCount: 8 },
  { id: "3", name: "Sales Assistant", documentCount: 3 },
  { id: "4", name: "Technical Helper", documentCount: 12 },
];

const mockDocuments = [
  {
    id: "1",
    botId: "1",
    botName: "Raun",
    fileName: "Bot_Details.zip",
    fileType: "zip",
    fileSize: "8.7 MB",
    characterCount: "76,119 characters",
    uploadDate: "17th Jul, 2024",
    status: "processed",
  },
  {
    id: "2",
    botId: "1",
    botName: "Raun",
    fileName: "Person.doc",
    fileType: "doc",
    fileSize: "3.7 MB",
    characterCount: "9,119 characters",
    uploadDate: "17th Jul, 2024",
    status: "processed",
  },
  {
    id: "3",
    botId: "1",
    botName: "Raun",
    fileName: "Zara.pdf",
    fileType: "pdf",
    fileSize: "2.4 MB",
    characterCount: "7,192 characters",
    uploadDate: "17th Jul, 2024",
    status: "processing",
  },
  {
    id: "4",
    botId: "1",
    botName: "Raun",
    fileName: "www.stylecheck.org",
    fileType: "url",
    fileSize: "3.7 MB",
    characterCount: "612 characters",
    uploadDate: "17th Jul, 2024",
    status: "processed",
  },
  {
    id: "5",
    botId: "1",
    botName: "Raun",
    fileName: "Zara.txt",
    fileType: "txt",
    fileSize: "2.95 KB",
    characterCount: "52 characters",
    uploadDate: "17th Jul, 2024",
    status: "processed",
  },
  {
    id: "6",
    botId: "2",
    botName: "Customer Support Bot",
    fileName: "FAQ_Database.pdf",
    fileType: "pdf",
    fileSize: "5.2 MB",
    characterCount: "45,230 characters",
    uploadDate: "16th Jul, 2024",
    status: "processed",
  },
  {
    id: "7",
    botId: "2",
    botName: "Customer Support Bot",
    fileName: "Support_Guidelines.docx",
    fileType: "doc",
    fileSize: "1.8 MB",
    characterCount: "12,450 characters",
    uploadDate: "15th Jul, 2024",
    status: "processed",
  },
];

const getFileIcon = (fileType: string) => {
  switch (fileType) {
    case "pdf":
      return <FileText className="size-4 text-primary" />;
    case "doc":
    case "docx":
      return <FileText className="size-4 text-accent-foreground" />;
    case "txt":
      return <FileText className="size-4 text-muted-foreground" />;
    case "zip":
      return (
        <FileArchive className="size-4 text-yellow-500 dark:text-yellow-400" />
      );
    case "url":
      return <Link className="size-4 text-accent" />;
    default:
      return <FileText className="size-4 text-muted-foreground" />;
  }
};

export default function DocumentsDashboard() {
  const [selectedBot, setSelectedBot] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [isAddContentOpen, setIsAddContentOpen] = useState(false);
  const [newDocumentContent, setNewDocumentContent] = useState("");
  const [newDocumentName, setNewDocumentName] = useState("");
  const [isAutoRefresh, setIsAutoRefresh] = useState(false);

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesBot = selectedBot === "all" || doc.botId === selectedBot;
    const matchesSearch = doc.fileName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesBot && matchesSearch;
  });

  const selectedBotData = mockBots.find((bot) => bot.id === selectedBot);
  const totalDocuments =
    selectedBot === "all"
      ? mockDocuments.length
      : mockDocuments.filter((doc) => doc.botId === selectedBot).length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDocuments(filteredDocuments.map((doc) => doc.id));
    } else {
      setSelectedDocuments([]);
    }
  };

  const handleSelectDocument = (documentId: string, checked: boolean) => {
    if (checked) {
      setSelectedDocuments([...selectedDocuments, documentId]);
    } else {
      setSelectedDocuments(selectedDocuments.filter((id) => id !== documentId));
    }
  };

  const handleDeleteSelected = () => {
    // Implementation for deleting selected documents
    console.log("Deleting documents:", selectedDocuments);
    setSelectedDocuments([]);
  };

  const handleRetrain = () => {
    // Implementation for retraining the bot
    console.log("Retraining bot:", selectedBot);
  };

  const handleAddContent = () => {
    // Implementation for adding new content
    console.log("Adding content:", {
      name: newDocumentName,
      content: newDocumentContent,
      botId: selectedBot,
    });
    setIsAddContentOpen(false);
    setNewDocumentContent("");
    setNewDocumentName("");
  };

  const handleDeleteBot = () => {
    // Implementation for deleting the bot
    console.log("Deleting bot:", selectedBot);
  };

  const toggleAutoRefresh = () => {
    setIsAutoRefresh(!isAutoRefresh);
    // Implementation for auto-refresh functionality
    console.log("Auto-refresh:", !isAutoRefresh);
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="bg-card rounded-lg shadow-sm border">
        {/* Header */}
        <div className="p-6 border-b border-border space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
            <h1 className="text-2xl font-semibold text-foreground">
              Documents
            </h1>
            {selectedBot !== "all" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="size-4 mr-2" />
                    Delete Bot
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Bot</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this bot? This action
                      cannot be undone and will remove all associated documents.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteBot}
                      className="bg-destructive hover:bg-destructive/80"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          {/* Bot Selection and Controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select value={selectedBot} onValueChange={setSelectedBot}>
                  <SelectTrigger className="w-full sm:w-48 min-w-[140px]">
                    <SelectValue placeholder="Select a bot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Bots</SelectItem>
                    {mockBots.map((bot) => (
                      <SelectItem key={bot.id} value={bot.id}>
                        {bot.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedBot !== "all" && (
                  <Button variant="ghost" size="sm">
                    <Edit className="size-4" />
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1 sm:mt-0">
                <span>{totalDocuments} documents</span>
                {selectedBotData && (
                  <Badge variant="secondary">{selectedBotData.name}</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Search and Action Bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full mt-2">
            <div className="flex flex-col sm:flex-row gap-2 flex-1 w-full">
              <div className="relative flex-1 max-w-md min-w-[180px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>

              {selectedDocuments.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="size-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Documents</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete{" "}
                        {selectedDocuments.length} selected document(s)? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteSelected}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>

            <div className="flex flex-row flex-wrap gap-2 items-center mt-2 md:mt-0">
              <Button variant="outline" size="sm" onClick={handleRetrain}>
                Retrain
              </Button>

              <Button
                variant={isAutoRefresh ? "default" : "outline"}
                size="sm"
                onClick={toggleAutoRefresh}
              >
                <RefreshCw
                  className={`size-4 mr-2 ${isAutoRefresh ? "animate-spin" : ""}`}
                />
                Auto-refresh
              </Button>

              <Dialog
                open={isAddContentOpen}
                onOpenChange={setIsAddContentOpen}
              >
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="size-4 mr-2" />
                    Add Content
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Document</DialogTitle>
                    <DialogDescription>
                      Add a new document to{" "}
                      {selectedBot === "all"
                        ? "your bots"
                        : selectedBotData?.name || "the selected bot"}
                      .
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {selectedBot === "all" && (
                      <div className="space-y-2">
                        <Label htmlFor="bot-select">Select Bot</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a bot" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockBots.map((bot) => (
                              <SelectItem key={bot.id} value={bot.id}>
                                {bot.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="document-name">Document Name</Label>
                      <Input
                        id="document-name"
                        placeholder="Enter document name"
                        value={newDocumentName}
                        onChange={(e) => setNewDocumentName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="document-content">Content</Label>
                      <Textarea
                        id="document-content"
                        placeholder="Paste your content here or upload a file..."
                        value={newDocumentContent}
                        onChange={(e) => setNewDocumentContent(e.target.value)}
                        rows={6}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddContentOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddContent}>Add Document</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Documents Table */}
        <div className="overflow-x-auto">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedDocuments.length === filteredDocuments.length &&
                      filteredDocuments.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="min-w-[180px]">File Name</TableHead>
                <TableHead className="min-w-[120px]">Bot</TableHead>
                <TableHead className="min-w-[100px]">Size</TableHead>
                <TableHead className="min-w-[110px]">Status</TableHead>
                <TableHead className="min-w-[120px]">Upload Date</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((document) => (
                <TableRow key={document.id} className="hover:bg-muted/60">
                  <TableCell>
                    <Checkbox
                      checked={selectedDocuments.includes(document.id)}
                      onCheckedChange={(checked) =>
                        handleSelectDocument(document.id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 min-w-0">
                      {getFileIcon(document.fileType)}
                      <div className="truncate">
                        <div className="font-medium truncate max-w-[180px]">
                          {document.fileName}
                        </div>
                        <div className="text-sm text-muted-foreground truncate max-w-[180px]">
                          {document.characterCount}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{document.botName}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {document.fileSize}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        document.status === "processed"
                          ? "default"
                          : "secondary"
                      }
                      className={
                        document.status === "processing" ? "animate-pulse" : ""
                      }
                    >
                      {document.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {document.uploadDate}
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Document</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete &quot;
                            {document.fileName}&quot;? This action cannot be
                            undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-destructive hover:bg-destructive/80">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="size-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No documents found
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? `No documents match your search "${searchQuery}"`
                : selectedBot === "all"
                  ? "You haven't added any documents yet"
                  : `No documents found for ${selectedBotData?.name}`}
            </p>
            <Button onClick={() => setIsAddContentOpen(true)}>
              <Plus className="size-4 mr-2" />
              Add Your First Document
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
