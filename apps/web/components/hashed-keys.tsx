"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Key, Shield, Eye, EyeOff, Copy, Check } from "lucide-react";

interface HashedKey {
  id: string;
  name: string;
  prefix: string;
  hash: string;
  created: string;
  lastUsed: string;
  status: "active" | "revoked" | "expired";
}

interface HashedKeyItemProps {
  keyData: HashedKey;
  className?: string;
}

const HashedKeyItem: React.FC<HashedKeyItemProps> = ({ keyData, className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const getStatusColor = () => {
    switch (keyData.status) {
      case "active":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "revoked":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      case "expired":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(keyData.hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const displayHash = isVisible 
    ? keyData.hash 
    : keyData.prefix + "•".repeat(32) + keyData.hash.slice(-4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm",
        className
      )}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div className="flex-shrink-0">
          <Key className="h-5 w-5 text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-white truncate">
              {keyData.name}
            </p>
            <span className={cn(
              "px-2 py-1 text-xs font-medium rounded-full border",
              getStatusColor()
            )}>
              {keyData.status}
            </span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <code className="text-xs text-white/70 font-mono bg-black/20 px-2 py-1 rounded truncate max-w-xs">
              {displayHash}
            </code>
            <button
              onClick={() => setIsVisible(!isVisible)}
              className="text-white/60 hover:text-white transition-colors"
              title={isVisible ? "Hide key" : "Show key"}
            >
              {isVisible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={handleCopy}
              className="text-white/60 hover:text-white transition-colors"
              title="Copy key"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
          <div className="flex items-center space-x-4 mt-2 text-xs text-white/60">
            <span>Created: {keyData.created}</span>
            <span>Last used: {keyData.lastUsed}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface HashedKeysProps {
  className?: string;
  maxKeys?: number;
}

export const HashedKeys: React.FC<HashedKeysProps> = ({ 
  className, 
  maxKeys = 4 
}) => {
  const [keys, setKeys] = useState<HashedKey[]>([]);

  const sampleKeys: HashedKey[] = [
    {
      id: "1",
      name: "Production API Key",
      prefix: "uk_",
      hash: "uk_1234567890abcdef1234567890abcdef12345678",
      created: "2 days ago",
      lastUsed: "5 min ago",
      status: "active"
    },
    {
      id: "2",
      name: "Development Key",
      prefix: "uk_",
      hash: "uk_abcdef1234567890abcdef1234567890abcdef12",
      created: "1 week ago",
      lastUsed: "2 hours ago",
      status: "active"
    },
    {
      id: "3",
      name: "Staging Environment",
      prefix: "uk_",
      hash: "uk_567890abcdef1234567890abcdef1234567890ab",
      created: "3 days ago",
      lastUsed: "1 day ago",
      status: "expired"
    },
    {
      id: "4",
      name: "Legacy Integration",
      prefix: "uk_",
      hash: "uk_cdef1234567890abcdef1234567890abcdef1234",
      created: "2 weeks ago",
      lastUsed: "1 week ago",
      status: "revoked"
    },
  ];

  useEffect(() => {
    // Simulate loading keys
    const timer = setTimeout(() => {
      setKeys(sampleKeys.slice(0, maxKeys));
    }, 500);

    return () => clearTimeout(timer);
  }, [maxKeys]);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center space-x-2 mb-4">
        <Shield className="h-5 w-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Hashed API Keys</h3>
        <div className="flex-1" />
        <div className="text-xs text-white/60">
          {keys.length} keys
        </div>
      </div>
      
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {keys.map((key) => (
            <HashedKeyItem
              key={key.id}
              keyData={key}
            />
          ))}
        </AnimatePresence>
      </div>
      
      {keys.length === 0 && (
        <div className="text-center py-8 text-white/60">
          <Key className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Loading API keys...</p>
        </div>
      )}
      
      <div className="mt-4 p-3 rounded-lg bg-blue-400/10 border border-blue-400/20">
        <div className="flex items-start space-x-2">
          <Shield className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-300">
            <p className="font-medium mb-1">One-way hashed keys</p>
            <p className="text-blue-300/80">
              Keys are hashed using SHA-256 and cannot be reversed. Only the hash is stored in our database for maximum security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HashedKeys;
