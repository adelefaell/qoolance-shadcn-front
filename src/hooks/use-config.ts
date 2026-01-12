import { useState, useEffect } from "react"

interface ConfigData {
  file: {
    /** Maximum allowed size for avatar images in kilobytes (KB) */
    avatar_max_size: number
    /** Maximum allowed size for banner images in kilobytes (KB) */
    banner_max_size: number
  }
  proposal: {
    max_duration: number
  }
  negotiation: {
    max_waiting_time_satisfier: number
  }
  dispute: {
    max_negotiation_time: number
    max_support_buffer_time: number
    max_support_response_time: number
    max_support_confirmation_time: number
    support_price: number
    lawyer_price: number
  }
  helpdesk: {
    enable_impersonation: boolean
  }
  workroom: {
    auto_release_milestones: number
    days_in_review: number
  }
  system: {
    auto_purge_after: number
    email: string
    phone: string
    address: string
  }
  milestone: {
    plan_amount_minimum: number
  }
}

export const useConfig = () => {
  const [loading, setLoading] = useState(true)
  const [config, setConfig] = useState<ConfigData | undefined>(undefined)

  useEffect(() => {
    // Mock API call - console.log instead
    console.log("Fetching config...")
    const mockData: ConfigData = {
      file: {
        avatar_max_size: 500,
        banner_max_size: 2000,
      },
      proposal: {
        max_duration: 30,
      },
      negotiation: {
        max_waiting_time_satisfier: 7,
      },
      dispute: {
        max_negotiation_time: 14,
        max_support_buffer_time: 3,
        max_support_response_time: 24,
        max_support_confirmation_time: 48,
        support_price: 50,
        lawyer_price: 200,
      },
      helpdesk: {
        enable_impersonation: false,
      },
      workroom: {
        auto_release_milestones: 7,
        days_in_review: 3,
      },
      system: {
        auto_purge_after: 365,
        email: "support@example.com",
        phone: "+1234567890",
        address: "123 Main St",
      },
      milestone: {
        plan_amount_minimum: 100,
      },
    }
    console.log("Config data:", mockData)
    setConfig(mockData)
    setLoading(false)
  }, [])

  return {
    loading,
    config,
  }
}
