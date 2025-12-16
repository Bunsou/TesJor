"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ContentItem } from "@/types";
import { PlaceCard } from "@/components/shared/PlaceCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryFilter } from "@/components/shared/CategoryFilter";

async function fetchSavedItems(type: "bookmarked" | "visited") {
  const res = await fetch(`/api/user/progress?type=${type}`);
  if (!res.ok) throw new Error("Failed to fetch saved items");
  return res.json();
}

export default function SavedPage() {
  const [activeTab, setActiveTab] = useState<"bookmarked" | "visited">(
    "bookmarked"
  );
  const [category, setCategory] = useState("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ["saved", activeTab],
    queryFn: () => fetchSavedItems(activeTab),
  });

  const items = (data?.items as ContentItem[]) ?? [];
  const filteredItems =
    category === "all"
      ? items
      : items.filter((item) => item.category === category);

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Saved Items</h1>
        <p className="text-foreground-muted">
          Your bookmarked and visited places
        </p>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as "bookmarked" | "visited")
        }
        className="mb-6"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
          <TabsTrigger value="visited">Visited</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {/* Category Filter */}
          <CategoryFilter
            selected={category === "all" ? null : category}
            onSelect={(cat) => setCategory(cat || "all")}
          />
        </div>

        <TabsContent value="bookmarked" className="mt-6">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="mt-4 text-foreground-muted">Loading...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-500">Failed to load bookmarked items</p>
            </div>
          )}

          {!isLoading && !error && filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-foreground-muted text-lg">
                No bookmarked items yet. Start exploring and bookmark your
                favorites!
              </p>
            </div>
          )}

          {!isLoading && !error && filteredItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <PlaceCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="visited" className="mt-6">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="mt-4 text-foreground-muted">Loading...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-500">Failed to load visited items</p>
            </div>
          )}

          {!isLoading && !error && filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-foreground-muted text-lg">
                No visited items yet. Check in to places you visit to track your
                journey!
              </p>
            </div>
          )}

          {!isLoading && !error && filteredItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <PlaceCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
