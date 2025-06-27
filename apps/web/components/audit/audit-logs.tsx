"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Shield, Key, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  resource: string;
  status: "success" | "warning" | "error";
  details: string;
}

interface AuditLogItemProps {
  entry: AuditLogEntry;
  className?: string;
}

const AuditLogItem: React.FC<AuditLogItemProps> = ({ entry, className }) => {
  const getIcon = () => {
    switch (entry.status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Shield className="h-4 w-4 text-blue-400" />;
    }
  };

  const getStatusColor = () => {
    switch (entry.status) {
      case "success":
        return "border-green-400/20 bg-green-400/5";
      case "warning":
        return "border-yellow-400/20 bg-yellow-400/5";
      case "error":
        return "border-red-400/20 bg-red-400/5";
      default:
        return "border-blue-400/20 bg-blue-400/5";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "flex items-start space-x-3 rounded-lg border p-3 backdrop-blur-sm",
        getStatusColor(),
        className
      )}
    >
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-white truncate">
            {entry.action}
          </p>
          <p className="text-xs text-white/60 flex-shrink-0 ml-2">
            {entry.timestamp}
          </p>
        </div>
        <p className="text-xs text-white/70 mt-1">
          {entry.user} • {entry.resource}
        </p>
        <p className="text-xs text-white/60 mt-1">
          {entry.details}
        </p>
      </div>
    </motion.div>
  );
};

interface AuditLogsProps {
  className?: string;
  maxEntries?: number;
}

export const AuditLogs: React.FC<AuditLogsProps> = ({ 
  className, 
  maxEntries = 5 
}) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);

  const sampleLogs: AuditLogEntry[] = [
    {
      id: "1",
      timestamp: "2 min ago",
      action: "API Key Created",
      user: "john.doe@company.com",
      resource: "prod-api-key-123",
      status: "success",
      details: "New production API key generated with full permissions"
    },
    {
      id: "2",
      timestamp: "5 min ago",
      action: "Rate Limit Exceeded",
      user: "api-user-456",
      resource: "endpoint:/api/v1/users",
      status: "warning",
      details: "Rate limit of 1000 req/min exceeded, requests throttled"
    },
    {
      id: "3",
      timestamp: "8 min ago",
      action: "Authentication Failed",
      user: "unknown",
      resource: "api-key-789",
      status: "error",
      details: "Invalid API key used for authentication attempt"
    },
    {
      id: "4",
      timestamp: "12 min ago",
      action: "Permission Updated",
      user: "admin@company.com",
      resource: "user-permissions",
      status: "success",
      details: "Updated API access permissions for development team"
    },
    {
      id: "5",
      timestamp: "15 min ago",
      action: "Key Revoked",
      user: "security@company.com",
      resource: "compromised-key-101",
      status: "warning",
      details: "API key revoked due to security policy violation"
    },
  ];

  useEffect(() => {
    // Simulate real-time log updates
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < sampleLogs.length) {
        setLogs(prev => [sampleLogs[currentIndex], ...prev.slice(0, maxEntries - 1)]);
        currentIndex++;
      } else {
        // Reset and start over
        currentIndex = 0;
        setLogs([]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [maxEntries]);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center space-x-2 mb-4">
        <Shield className="h-5 w-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Audit Logs</h3>
        <div className="flex-1" />
        <div className="text-xs text-white/60">
          Live updates
        </div>
      </div>
      
      <div className="space-y-2 max-h-80 overflow-hidden">
        <AnimatePresence mode="popLayout">
          {logs.map((entry) => (
            <AuditLogItem
              key={entry.id}
              entry={entry}
            />
          ))}
        </AnimatePresence>
      </div>
      
      {logs.length === 0 && (
        <div className="text-center py-8 text-white/60">
          <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Loading audit logs...</p>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
