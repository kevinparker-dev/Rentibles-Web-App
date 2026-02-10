"use client";

import { Button } from "@/components/ui/button";
import GoogleMapComponent from "@/src/components/common/GoogleMapPicker";
import { InputField } from "@/src/components/common/InputField";
import { SelectField } from "@/src/components/common/SelectField";
import ToggleSelectField from "@/src/components/common/ToggleSelectField";
import { CreateProductPayload, createProductSchema } from "@/src/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Camera, ImagePlus, Plus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import DaySelector from "./DaySelector";
import { DaysOfWeek, LocationSelect, User } from "@/src/types/index.type";
import { useAppDispatch, useAppSelector } from "@/src/lib/store/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createProduct, getCategories } from "@/src/lib/query/queryFn";
import {
  setCategoriesError,
  setCategoriesLoading,
  setCategoriesSuccess,
} from "@/src/lib/store/feature/appSlice";
import { useCategories, useSubCategories } from "@/src/lib/api/products";
import { ErrorToast } from "@/src/components/common/Toaster";
import { Input } from "@/components/ui/input";
import { getAxiosErrorMessage } from "@/src/utils/errorHandlers";
import { toUnixTimestamp } from "@/src/utils/helperFunctions";
import { ProductImagesInput } from "./ProductImagesInput";
import { CoverImageInput } from "./CoverImageInput";

const TimeOptions = [
  { label: "06:00 AM", value: "06:00" },
  { label: "07:00 AM", value: "07:00" },
  { label: "08:00 AM", value: "08:00" },
  { label: "09:00 AM", value: "09:00" },
  { label: "10:00 AM", value: "10:00" },
  { label: "11:00 AM", value: "11:00" },
  { label: "12:00 PM", value: "12:00" },
  { label: "01:00 PM", value: "13:00" },
  { label: "02:00 PM", value: "14:00" },
  { label: "03:00 PM", value: "15:00" },
  { label: "04:00 PM", value: "16:00" },
  { label: "05:00 PM", value: "17:00" },
  { label: "06:00 PM", value: "18:00" },
  { label: "07:00 PM", value: "19:00" },
  { label: "08:00 PM", value: "20:00" },
];

const CreateProductForm = () => {
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const { location: locationValue } = user || {};

  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
  } | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] =
    useState<string>("");

  const [selectedDays, setSelectedDays] = useState<DaysOfWeek>();
  const { categories } = useAppSelector((state) => state.categories);

  const { data, isLoading, isError, error } = useCategories();
  const {
    data: subCategoriesData,
    isLoading: isSubCategoriesLoading,
    isError: isSubCategoriesError,
    error: subCategoriesError,
  } = useSubCategories(selectedCategoryId);

  // Store categories in Redux when data is fetched
  useEffect(() => {
    if (isLoading) {
      dispatch(setCategoriesLoading(true));
    }

    if (data?.data) {
      dispatch(setCategoriesSuccess(data?.data));
    }

    if (isError) {
      dispatch(
        setCategoriesError(error.message || "Failed to fetch categories"),
      );
    }
  }, [data, isLoading, isError, error, dispatch]);

  // Transform categories array to options format
  const categoryOptions = useMemo(() => {
    return categories.map((category) => ({
      label: category.name.trim(), // trim to remove extra spaces
      value: category._id,
    }));
  }, [categories]);

  const handleDaysChange = (days: DaysOfWeek) => {
    setSelectedDays(days);
  };

  const subCategoryOptions = useMemo(() => {
    return subCategoriesData?.data?.map((subCategory) => ({
      label: subCategory.name.trim(),
      value: subCategory._id,
    }));
  }, [subCategoriesData]);

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setSelectedCategoryId(categoryId);
    setSelectedSubCategoryId(""); // Reset subcategory when category changes
  };

  // Handle subcategory change
  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubCategoryId(e.target.value);
  };

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<CreateProductPayload>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      productName: "",
      description: "",
      quantity: "0",
      category: "",
      subCategory: "",
      availableDays: [],
      pickupTime: "",
      dropOffTime: "",
      hourlyPrice: "0",
      dailyPrice: "0",
      images: [],
      coverImage: null,
      location: undefined,
    },
  });

  const onLocationSelect = (loc: LocationSelect) => {
    const lat = loc.location.coordinates[1];
    const lng = loc.location.coordinates[0];

    setLocation({
      lat,
      lng,
      address: loc.address,
      city: loc.city,
      state: loc.state,
      country: loc.country,
    });
    // setValue("location", { lat, lng });
    // clearErrors("location");
  };

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      // success handling
      // toast, redirect, reset form etc.
      console.log("Product created successfully");
    },
    onError: (err) => {
      const message = getAxiosErrorMessage(err || "Failed to create product");
      ErrorToast(message);
    },
  });

  const onsubmit = (data: CreateProductPayload) => {
    console.log("🚀 ~ onsubmit ~ data:", data);
    const formData = new FormData();

    // Basic fields
    formData.append("name", data.productName);
    formData.append("description", data.description);
    formData.append("quantity", String(data.quantity));
    formData.append("categoryId", selectedCategoryId);
    formData.append("subCategoryId", selectedSubCategoryId);
    formData.append("pickupTime", toUnixTimestamp(data.pickupTime).toString());
    formData.append(
      "dropOffTime",
      toUnixTimestamp(data.dropOffTime).toString(),
    );

    formData.append("pricePerHour", String(data.hourlyPrice));
    formData.append("pricePerDay", String(data.dailyPrice));
    formData.append("pickupAddress", user?.address || "");

    // Available days
    selectedDays
      ?.filter((d) => d.enabled)
      .forEach((d) => {
        formData.append("availableDays[]", d.day);
      });

    // Location
    const longitude = locationValue?.coordinates[0]; // -81.22187770000001
    const latitude = locationValue?.coordinates[1];
    if (locationValue?.coordinates) {
      formData.append("longitude", String(longitude));
      formData.append("latitude", String(latitude));
    }

    // Cover image
    if (data.coverImage) {
      formData.append("cover", data.coverImage);
    }

    // Product images
    data.images.forEach((file) => {
      formData.append("images", file);
    });

    createProductMutation.mutate(formData);
  };

  return (
    <div className=" mx-auto px-4 py-6 text-white">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-xl font-semibold text-foreground">Add Product</h1>
      </div>
      <form action="" onSubmit={handleSubmit(onsubmit)}>
        <div className="space-y-6">
          <ProductImagesInput
            value={watch("images")}
            onChange={(files) =>
              setValue("images", files, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            error={errors.images?.message}
          />

          <CoverImageInput
            value={watch("coverImage")}
            onChange={(file) =>
              setValue("coverImage", file, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            error={errors.coverImage?.message as string}
          />
        </div>

        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Product Name"
              error={errors.productName?.message}
              {...register("productName")}
              placeholder="Enter Product Name"
            />
            <InputField
              error={errors.description?.message}
              {...register("description")}
              label="Description"
              placeholder="Enter Description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              type="number"
              label="Quantity"
              placeholder="Enter Quantity"
              error={errors.quantity?.message}
              {...register("quantity")}
            />
            <SelectField
              label="Category"
              placeholder="Select Category"
              options={categoryOptions}
              onChange={handleCategoryChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedCategoryId && (
              <SelectField
                label="Sub Category"
                placeholder={
                  isSubCategoriesLoading
                    ? "Loading subcategories..."
                    : "Select Subcategory"
                }
                options={subCategoryOptions}
                // value={selectedSubCategoryId}
                onChange={handleSubCategoryChange}
                disabled={isSubCategoriesLoading || !selectedCategoryId}
              />
            )}

            <div className="">
              <DaySelector
                selectedDays={selectedDays}
                onChange={handleDaysChange}
                label="Working Days"
                showSelectedCount={true}
              />
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 mt-6 text-sm text-muted-foreground">
          <AlertCircle size={16} />
          <p>
            The product location you select must match your device&apos;s
            timezone for accurate booking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <SelectField
            label="Pick Up Time"
            placeholder="Select"
            options={TimeOptions}
            error={errors.pickupTime?.message}
            {...register("pickupTime")}
          />
          <SelectField
            label="Drop Off Time"
            placeholder="Select"
            options={TimeOptions}
            error={errors.dropOffTime?.message}
            {...register("dropOffTime")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <InputField
            type="number"
            label="Hourly Price"
            placeholder="Enter Price"
            error={errors.hourlyPrice?.message}
            {...register("hourlyPrice")}
          />
          <InputField
            type="number"
            label="Daily Price"
            placeholder="Enter Price"
            error={errors.dailyPrice?.message}
            {...register("dailyPrice")}
          />
        </div>
        <div className="flex gap-4 mt-6">
          <button className="bg-[#F85E00] cursor-pointer h-12 rounded-xl px-6 text-sm font-medium">
            Same as Profile
          </button>

          <button className="bg-foreground h-12  cursor-pointer rounded-xl px-6 flex items-center gap-2 text-sm font-medium">
            <Plus size={16} />
            Add New
          </button>
        </div>

        <div className="mt-4">
          <GoogleMapComponent onLocationSelect={onLocationSelect} />
        </div>
        <div className="flex items-start gap-2 mt-6 text-sm text-muted-foreground">
          <AlertCircle size={16} />
          <p>
            Every booking comes with peace of mind! You'll get an email to
            review and sign the contract before pickup-every time. No signature,
            no handoff.
          </p>
        </div>
        <Button type="submit" disabled={createProductMutation.isPending}>
          {createProductMutation.isPending
            ? "Submitting..."
            : "Add Rental Product"}
        </Button>
      </form>
    </div>
  );
};

export default CreateProductForm;
