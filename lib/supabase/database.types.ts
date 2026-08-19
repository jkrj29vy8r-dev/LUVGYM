export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      Account: {
        Row: {
          access_token: string | null
          expires_at: number | null
          id: string
          id_token: string | null
          provider: string
          providerAccountId: string
          refresh_token: string | null
          scope: string | null
          session_state: string | null
          token_type: string | null
          type: string
          userId: string
        }
        Insert: {
          access_token?: string | null
          expires_at?: number | null
          id: string
          id_token?: string | null
          provider: string
          providerAccountId: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type: string
          userId: string
        }
        Update: {
          access_token?: string | null
          expires_at?: number | null
          id?: string
          id_token?: string | null
          provider?: string
          providerAccountId?: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Account_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Availability: {
        Row: {
          date: string
          endTime: string
          id: string
          isBooked: boolean
          startTime: string
          vendorId: string
        }
        Insert: {
          date: string
          endTime: string
          id: string
          isBooked?: boolean
          startTime: string
          vendorId: string
        }
        Update: {
          date?: string
          endTime?: string
          id?: string
          isBooked?: boolean
          startTime?: string
          vendorId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Availability_vendorId_fkey"
            columns: ["vendorId"]
            isOneToOne: false
            referencedRelation: "VendorProfile"
            referencedColumns: ["id"]
          },
        ]
      }
      Booking: {
        Row: {
          availabilityId: string | null
          createdAt: string
          customerId: string
          id: string
          paymentType: Database["public"]["Enums"]["PaymentType"]
          serviceId: string
          slotEnd: string
          slotStart: string
          status: Database["public"]["Enums"]["BookingStatus"]
          totalPriceRON: number
          updatedAt: string
        }
        Insert: {
          availabilityId?: string | null
          createdAt?: string
          customerId: string
          id: string
          paymentType: Database["public"]["Enums"]["PaymentType"]
          serviceId: string
          slotEnd: string
          slotStart: string
          status?: Database["public"]["Enums"]["BookingStatus"]
          totalPriceRON: number
          updatedAt: string
        }
        Update: {
          availabilityId?: string | null
          createdAt?: string
          customerId?: string
          id?: string
          paymentType?: Database["public"]["Enums"]["PaymentType"]
          serviceId?: string
          slotEnd?: string
          slotStart?: string
          status?: Database["public"]["Enums"]["BookingStatus"]
          totalPriceRON?: number
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Booking_availabilityId_fkey"
            columns: ["availabilityId"]
            isOneToOne: false
            referencedRelation: "Availability"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Booking_customerId_fkey"
            columns: ["customerId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Booking_serviceId_fkey"
            columns: ["serviceId"]
            isOneToOne: false
            referencedRelation: "Service"
            referencedColumns: ["id"]
          },
        ]
      }
      Category: {
        Row: {
          icon: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          icon: string
          id: string
          name: string
          slug: string
        }
        Update: {
          icon?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      CompanyProfile: {
        Row: {
          companyName: string
          createdAt: string
          cui: string
          id: string
          regCom: string
          sediuSocial: string
          userId: string
          validatedAt: string | null
        }
        Insert: {
          companyName: string
          createdAt?: string
          cui: string
          id: string
          regCom: string
          sediuSocial: string
          userId: string
          validatedAt?: string | null
        }
        Update: {
          companyName?: string
          createdAt?: string
          cui?: string
          id?: string
          regCom?: string
          sediuSocial?: string
          userId?: string
          validatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "CompanyProfile_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Invoice: {
        Row: {
          buyerAddress: string
          buyerCui: string | null
          buyerName: string
          companyProfileId: string | null
          id: string
          issuedAt: string
          number: number
          pdfUrl: string | null
          series: string
          totalGrossRON: number
          totalNetRON: number
          totalVatRON: number
          transactionId: string
          type: Database["public"]["Enums"]["InvoiceType"]
        }
        Insert: {
          buyerAddress: string
          buyerCui?: string | null
          buyerName: string
          companyProfileId?: string | null
          id: string
          issuedAt?: string
          number: number
          pdfUrl?: string | null
          series: string
          totalGrossRON: number
          totalNetRON: number
          totalVatRON: number
          transactionId: string
          type: Database["public"]["Enums"]["InvoiceType"]
        }
        Update: {
          buyerAddress?: string
          buyerCui?: string | null
          buyerName?: string
          companyProfileId?: string | null
          id?: string
          issuedAt?: string
          number?: number
          pdfUrl?: string | null
          series?: string
          totalGrossRON?: number
          totalNetRON?: number
          totalVatRON?: number
          transactionId?: string
          type?: Database["public"]["Enums"]["InvoiceType"]
        }
        Relationships: [
          {
            foreignKeyName: "Invoice_companyProfileId_fkey"
            columns: ["companyProfileId"]
            isOneToOne: false
            referencedRelation: "CompanyProfile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Invoice_transactionId_fkey"
            columns: ["transactionId"]
            isOneToOne: false
            referencedRelation: "Transaction"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          id: string
          matched_at: string
          user_1: string
          user_2: string
        }
        Insert: {
          id?: string
          matched_at?: string
          user_1: string
          user_2: string
        }
        Update: {
          id?: string
          matched_at?: string
          user_1?: string
          user_2?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_user_1_fkey"
            columns: ["user_1"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_user_2_fkey"
            columns: ["user_2"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      Message: {
        Row: {
          body: string
          createdAt: string
          id: string
          rfqId: string | null
          senderId: string
          vendorId: string | null
        }
        Insert: {
          body: string
          createdAt?: string
          id: string
          rfqId?: string | null
          senderId: string
          vendorId?: string | null
        }
        Update: {
          body?: string
          createdAt?: string
          id?: string
          rfqId?: string | null
          senderId?: string
          vendorId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Message_rfqId_fkey"
            columns: ["rfqId"]
            isOneToOne: false
            referencedRelation: "RFQ"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Message_senderId_fkey"
            columns: ["senderId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Message_vendorId_fkey"
            columns: ["vendorId"]
            isOneToOne: false
            referencedRelation: "VendorProfile"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          created_at: string
          id: string
          is_workout_invite: boolean
          match_id: string
          sender_id: string
          text: string | null
          workout_details: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_workout_invite?: boolean
          match_id: string
          sender_id: string
          text?: string | null
          workout_details?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          is_workout_invite?: boolean
          match_id?: string
          sender_id?: string
          text?: string | null
          workout_details?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          gym_chain: string | null
          id: string
          looking_for: Database["public"]["Enums"]["looking_for_type"] | null
          preferred_schedule: string | null
          updated_at: string
          workout_type: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          gym_chain?: string | null
          id: string
          looking_for?: Database["public"]["Enums"]["looking_for_type"] | null
          preferred_schedule?: string | null
          updated_at?: string
          workout_type?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          gym_chain?: string | null
          id?: string
          looking_for?: Database["public"]["Enums"]["looking_for_type"] | null
          preferred_schedule?: string | null
          updated_at?: string
          workout_type?: string | null
        }
        Relationships: []
      }
      PromotionPurchase: {
        Row: {
          amountPaidRON: number
          createdAt: string
          endsAt: string
          id: string
          plan: Database["public"]["Enums"]["PromotionPlan"]
          startsAt: string
          vendorId: string
        }
        Insert: {
          amountPaidRON: number
          createdAt?: string
          endsAt: string
          id: string
          plan: Database["public"]["Enums"]["PromotionPlan"]
          startsAt: string
          vendorId: string
        }
        Update: {
          amountPaidRON?: number
          createdAt?: string
          endsAt?: string
          id?: string
          plan?: Database["public"]["Enums"]["PromotionPlan"]
          startsAt?: string
          vendorId?: string
        }
        Relationships: [
          {
            foreignKeyName: "PromotionPurchase_vendorId_fkey"
            columns: ["vendorId"]
            isOneToOne: false
            referencedRelation: "VendorProfile"
            referencedColumns: ["id"]
          },
        ]
      }
      Review: {
        Row: {
          bookingId: string
          comment: string | null
          createdAt: string
          id: string
          rating: number
          vendorId: string
        }
        Insert: {
          bookingId: string
          comment?: string | null
          createdAt?: string
          id: string
          rating: number
          vendorId: string
        }
        Update: {
          bookingId?: string
          comment?: string | null
          createdAt?: string
          id?: string
          rating?: number
          vendorId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Review_vendorId_fkey"
            columns: ["vendorId"]
            isOneToOne: false
            referencedRelation: "VendorProfile"
            referencedColumns: ["id"]
          },
        ]
      }
      RFQ: {
        Row: {
          budgetMaxRON: number | null
          budgetMinRON: number | null
          companyId: string
          companyProfileId: string
          createdAt: string
          description: string
          id: string
          serviceId: string | null
          status: Database["public"]["Enums"]["RFQStatus"]
          title: string
          updatedAt: string
        }
        Insert: {
          budgetMaxRON?: number | null
          budgetMinRON?: number | null
          companyId: string
          companyProfileId: string
          createdAt?: string
          description: string
          id: string
          serviceId?: string | null
          status?: Database["public"]["Enums"]["RFQStatus"]
          title: string
          updatedAt: string
        }
        Update: {
          budgetMaxRON?: number | null
          budgetMinRON?: number | null
          companyId?: string
          companyProfileId?: string
          createdAt?: string
          description?: string
          id?: string
          serviceId?: string | null
          status?: Database["public"]["Enums"]["RFQStatus"]
          title?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "RFQ_companyId_fkey"
            columns: ["companyId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "RFQ_companyProfileId_fkey"
            columns: ["companyProfileId"]
            isOneToOne: false
            referencedRelation: "CompanyProfile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "RFQ_serviceId_fkey"
            columns: ["serviceId"]
            isOneToOne: false
            referencedRelation: "Service"
            referencedColumns: ["id"]
          },
        ]
      }
      RFQOffer: {
        Row: {
          createdAt: string
          id: string
          message: string
          priceRON: number
          rfqId: string
          status: Database["public"]["Enums"]["RFQOfferStatus"]
          vendorId: string
        }
        Insert: {
          createdAt?: string
          id: string
          message: string
          priceRON: number
          rfqId: string
          status?: Database["public"]["Enums"]["RFQOfferStatus"]
          vendorId: string
        }
        Update: {
          createdAt?: string
          id?: string
          message?: string
          priceRON?: number
          rfqId?: string
          status?: Database["public"]["Enums"]["RFQOfferStatus"]
          vendorId?: string
        }
        Relationships: [
          {
            foreignKeyName: "RFQOffer_rfqId_fkey"
            columns: ["rfqId"]
            isOneToOne: false
            referencedRelation: "RFQ"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "RFQOffer_vendorId_fkey"
            columns: ["vendorId"]
            isOneToOne: false
            referencedRelation: "VendorProfile"
            referencedColumns: ["id"]
          },
        ]
      }
      Service: {
        Row: {
          active: boolean
          categoryId: string
          createdAt: string
          description: string
          durationMins: number | null
          id: string
          priceNetRON: number
          pricingType: Database["public"]["Enums"]["PricingType"]
          title: string
          unit: string | null
          updatedAt: string
          vatRate: number
          vendorId: string
        }
        Insert: {
          active?: boolean
          categoryId: string
          createdAt?: string
          description: string
          durationMins?: number | null
          id: string
          priceNetRON: number
          pricingType: Database["public"]["Enums"]["PricingType"]
          title: string
          unit?: string | null
          updatedAt: string
          vatRate?: number
          vendorId: string
        }
        Update: {
          active?: boolean
          categoryId?: string
          createdAt?: string
          description?: string
          durationMins?: number | null
          id?: string
          priceNetRON?: number
          pricingType?: Database["public"]["Enums"]["PricingType"]
          title?: string
          unit?: string | null
          updatedAt?: string
          vatRate?: number
          vendorId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Service_categoryId_fkey"
            columns: ["categoryId"]
            isOneToOne: false
            referencedRelation: "Category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Service_vendorId_fkey"
            columns: ["vendorId"]
            isOneToOne: false
            referencedRelation: "VendorProfile"
            referencedColumns: ["id"]
          },
        ]
      }
      Session: {
        Row: {
          expires: string
          id: string
          sessionToken: string
          userId: string
        }
        Insert: {
          expires: string
          id: string
          sessionToken: string
          userId: string
        }
        Update: {
          expires?: string
          id?: string
          sessionToken?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Session_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      SubAccount: {
        Row: {
          companyProfileId: string
          createdAt: string
          id: string
          userId: string
        }
        Insert: {
          companyProfileId: string
          createdAt?: string
          id: string
          userId: string
        }
        Update: {
          companyProfileId?: string
          createdAt?: string
          id?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "SubAccount_companyProfileId_fkey"
            columns: ["companyProfileId"]
            isOneToOne: false
            referencedRelation: "CompanyProfile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "SubAccount_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      swipes: {
        Row: {
          created_at: string
          direction: Database["public"]["Enums"]["swipe_direction"]
          id: string
          swiped_id: string
          swiper_id: string
        }
        Insert: {
          created_at?: string
          direction: Database["public"]["Enums"]["swipe_direction"]
          id?: string
          swiped_id: string
          swiper_id: string
        }
        Update: {
          created_at?: string
          direction?: Database["public"]["Enums"]["swipe_direction"]
          id?: string
          swiped_id?: string
          swiper_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "swipes_swiped_id_fkey"
            columns: ["swiped_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swipes_swiper_id_fkey"
            columns: ["swiper_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      Transaction: {
        Row: {
          amountRON: number
          bankProofUrl: string | null
          bookingId: string | null
          createdAt: string
          id: string
          method: Database["public"]["Enums"]["PaymentType"]
          rfqOfferId: string | null
          status: Database["public"]["Enums"]["TransactionStatus"]
          stripePaymentId: string | null
          updatedAt: string
        }
        Insert: {
          amountRON: number
          bankProofUrl?: string | null
          bookingId?: string | null
          createdAt?: string
          id: string
          method: Database["public"]["Enums"]["PaymentType"]
          rfqOfferId?: string | null
          status?: Database["public"]["Enums"]["TransactionStatus"]
          stripePaymentId?: string | null
          updatedAt: string
        }
        Update: {
          amountRON?: number
          bankProofUrl?: string | null
          bookingId?: string | null
          createdAt?: string
          id?: string
          method?: Database["public"]["Enums"]["PaymentType"]
          rfqOfferId?: string | null
          status?: Database["public"]["Enums"]["TransactionStatus"]
          stripePaymentId?: string | null
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Transaction_bookingId_fkey"
            columns: ["bookingId"]
            isOneToOne: false
            referencedRelation: "Booking"
            referencedColumns: ["id"]
          },
        ]
      }
      User: {
        Row: {
          avatarUrl: string | null
          clerkId: string | null
          createdAt: string
          email: string
          emailVerified: string | null
          id: string
          name: string
          passwordHash: string | null
          role: Database["public"]["Enums"]["UserRole"]
          updatedAt: string
        }
        Insert: {
          avatarUrl?: string | null
          clerkId?: string | null
          createdAt?: string
          email: string
          emailVerified?: string | null
          id: string
          name: string
          passwordHash?: string | null
          role?: Database["public"]["Enums"]["UserRole"]
          updatedAt: string
        }
        Update: {
          avatarUrl?: string | null
          clerkId?: string | null
          createdAt?: string
          email?: string
          emailVerified?: string | null
          id?: string
          name?: string
          passwordHash?: string | null
          role?: Database["public"]["Enums"]["UserRole"]
          updatedAt?: string
        }
        Relationships: []
      }
      VendorProfile: {
        Row: {
          bio: string | null
          createdAt: string
          displayName: string
          galleryUrls: string[]
          id: string
          promotedUntil: string | null
          promotionPlan: Database["public"]["Enums"]["PromotionPlan"] | null
          ratingAvg: number
          ratingCount: number
          updatedAt: string
          userId: string
          verifiedBadge: boolean
        }
        Insert: {
          bio?: string | null
          createdAt?: string
          displayName: string
          galleryUrls?: string[]
          id: string
          promotedUntil?: string | null
          promotionPlan?: Database["public"]["Enums"]["PromotionPlan"] | null
          ratingAvg?: number
          ratingCount?: number
          updatedAt: string
          userId: string
          verifiedBadge?: boolean
        }
        Update: {
          bio?: string | null
          createdAt?: string
          displayName?: string
          galleryUrls?: string[]
          id?: string
          promotedUntil?: string | null
          promotionPlan?: Database["public"]["Enums"]["PromotionPlan"] | null
          ratingAvg?: number
          ratingCount?: number
          updatedAt?: string
          userId?: string
          verifiedBadge?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "VendorProfile_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      record_swipe: {
        Args: {
          p_direction: Database["public"]["Enums"]["swipe_direction"]
          p_swiped_id: string
        }
        Returns: {
          match_id: string
          matched: boolean
        }[]
      }
    }
    Enums: {
      AutoReplyMode:
        | "DISABLED"
        | "FIVE_STARS"
        | "FOUR_FIVE_STARS"
        | "MANUAL_APPROVAL"
      BookingStatus: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"
      InvoiceType: "PROFORMA" | "INVOICE"
      looking_for_type: "GYM_BUDDY" | "DATING" | "BOTH"
      NotificationType:
        | "NEW_REVIEW"
        | "REPLY_PUBLISHED"
        | "AUTO_REPLY_TRIGGERED"
        | "SUBSCRIPTION_CHANGE"
        | "TEAM_INVITE"
      PaymentType: "CARD" | "BANK_TRANSFER"
      PricingType: "FIXED" | "PER_UNIT"
      PromotionPlan:
        | "TOP_SEARCH_7D"
        | "TOP_SEARCH_30D"
        | "FEATURED_HOME_7D"
        | "FEATURED_HOME_30D"
      ReplyTone:
        | "PROFESIONAL"
        | "PRIETENOS"
        | "ELEGANT"
        | "PREMIUM"
        | "LUX"
        | "RESTAURANT"
        | "HOTEL"
        | "CLINICA"
        | "AUTO"
        | "SALON"
        | "CORPORATE"
        | "RELAXAT"
        | "AMUZANT"
        | "FORMAL"
      ReviewSentiment: "POSITIVE" | "NEUTRAL" | "NEGATIVE"
      RFQOfferStatus: "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN"
      RFQStatus: "OPEN" | "OFFER_RECEIVED" | "ACCEPTED" | "REJECTED" | "CLOSED"
      SubscriptionPlan: "FREE" | "PRO" | "BUSINESS" | "ENTERPRISE"
      SubscriptionStatus:
        | "ACTIVE"
        | "CANCELED"
        | "PAST_DUE"
        | "TRIALING"
        | "INACTIVE"
      swipe_direction: "like" | "pass" | "super_like"
      TransactionStatus:
        | "PENDING"
        | "PAID"
        | "AWAITING_PROOF"
        | "FAILED"
        | "REFUNDED"
      UserRole: "CUSTOMER_B2C" | "CUSTOMER_B2B" | "VENDOR" | "ADMIN" | "OPERATOR"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      AutoReplyMode: [
        "DISABLED",
        "FIVE_STARS",
        "FOUR_FIVE_STARS",
        "MANUAL_APPROVAL",
      ],
      BookingStatus: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"],
      InvoiceType: ["PROFORMA", "INVOICE"],
      looking_for_type: ["GYM_BUDDY", "DATING", "BOTH"],
      NotificationType: [
        "NEW_REVIEW",
        "REPLY_PUBLISHED",
        "AUTO_REPLY_TRIGGERED",
        "SUBSCRIPTION_CHANGE",
        "TEAM_INVITE",
      ],
      PaymentType: ["CARD", "BANK_TRANSFER"],
      PricingType: ["FIXED", "PER_UNIT"],
      PromotionPlan: [
        "TOP_SEARCH_7D",
        "TOP_SEARCH_30D",
        "FEATURED_HOME_7D",
        "FEATURED_HOME_30D",
      ],
      ReplyTone: [
        "PROFESIONAL",
        "PRIETENOS",
        "ELEGANT",
        "PREMIUM",
        "LUX",
        "RESTAURANT",
        "HOTEL",
        "CLINICA",
        "AUTO",
        "SALON",
        "CORPORATE",
        "RELAXAT",
        "AMUZANT",
        "FORMAL",
      ],
      ReviewSentiment: ["POSITIVE", "NEUTRAL", "NEGATIVE"],
      RFQOfferStatus: ["PENDING", "ACCEPTED", "REJECTED", "WITHDRAWN"],
      RFQStatus: ["OPEN", "OFFER_RECEIVED", "ACCEPTED", "REJECTED", "CLOSED"],
      SubscriptionPlan: ["FREE", "PRO", "BUSINESS", "ENTERPRISE"],
      SubscriptionStatus: [
        "ACTIVE",
        "CANCELED",
        "PAST_DUE",
        "TRIALING",
        "INACTIVE",
      ],
      swipe_direction: ["like", "pass", "super_like"],
      TransactionStatus: [
        "PENDING",
        "PAID",
        "AWAITING_PROOF",
        "FAILED",
        "REFUNDED",
      ],
      UserRole: ["CUSTOMER_B2C", "CUSTOMER_B2B", "VENDOR", "ADMIN", "OPERATOR"],
    },
  },
} as const
