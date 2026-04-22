import { useEffect, useRef, useState } from "react";
import { getUserDashboard, getProperties } from "../services/dashboardService";
import PropertyListUser from "../components/PropertyListUser";

function UserDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [commissionForm, setCommissionForm] = useState({
    salePrice: "",
    commissionPercent: "3",
    brokerSplitPercent: "0",
    referralPercent: "0",
    transactionFee: "0",
  });
  const [showSavedCommissions, setShowSavedCommissions] = useState(false);
  const [savedCommissionScenarios, setSavedCommissionScenarios] = useState([]);
  const [expandedCommissionId, setExpandedCommissionId] = useState(null);

  const [showPresentationModal, setShowPresentationModal] = useState(false);
  const [presentationForm, setPresentationForm] = useState({
    presentationType: "Buyer",
    clientName: "",
    propertyAddress: "",
    notes: "",
  });
  const [showSavedPresentations, setShowSavedPresentations] = useState(false);
  const [savedPresentations, setSavedPresentations] = useState([]);
  const [expandedPresentationId, setExpandedPresentationId] = useState(null);

  const [showAiModal, setShowAiModal] = useState(false);
  const [aiAssistantForm, setAiAssistantForm] = useState({
    taskType: "LISTING_DESCRIPTION",
    audience: "Buyer",
    tone: "Professional",
    propertyAddress: "",
    cityState: "",
    pricePoint: "",
    bedsBaths: "",
    propertyType: "",
    transactionStage: "",
    callToAction: "",
    context: "",
  });
  const [aiOutput, setAiOutput] = useState("");
  const [showSavedAiDrafts, setShowSavedAiDrafts] = useState(false);
  const [savedAiDrafts, setSavedAiDrafts] = useState([]);
  const [expandedAiDraftId, setExpandedAiDraftId] = useState(null);

  const [properties, setProperties] = useState([]);

  const profileMenuRef = useRef(null);

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");
  const loggedInUserId = loggedInUser?.id || null;

  useEffect(() => {
    if (!loggedInUserId) {
      window.location.href = "/login";
      return;
    }

    loadDashboard();
  }, [loggedInUserId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await getUserDashboard(loggedInUserId);

      let allProperties = [];
      try {
        allProperties = await getProperties();
        allProperties = allProperties.filter((prop) => prop.user?.id === loggedInUserId);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
      }

      setProperties(allProperties);
      setDashboard({ ...data, properties: allProperties });
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  if (!loggedInUserId) {
    return null;
  }

  const user = dashboard?.user || {};
  const userId = user?.id || loggedInUserId;

  const userName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.firstName ||
        (loggedInUser?.firstName && loggedInUser?.lastName
          ? `${loggedInUser.firstName} ${loggedInUser.lastName}`
          : loggedInUser?.firstName || "User");

  const userEmail = user?.email || loggedInUser?.email || "No email available";
  const userRole = user?.role || loggedInUser?.role || "USER";

  const handleCommissionChange = (e) => {
    const { name, value } = e.target;
    setCommissionForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const salePrice = Number(commissionForm.salePrice) || 0;
  const commissionPercent = Number(commissionForm.commissionPercent) || 0;
  const brokerSplitPercent = Number(commissionForm.brokerSplitPercent) || 0;
  const referralPercent = Number(commissionForm.referralPercent) || 0;
  const transactionFee = Number(commissionForm.transactionFee) || 0;

  const grossCommission = salePrice * (commissionPercent / 100);
  const referralAmount = grossCommission * (referralPercent / 100);
  const afterReferral = grossCommission - referralAmount;
  const brokerSplitAmount = afterReferral * (brokerSplitPercent / 100);
  const estimatedNet = afterReferral - brokerSplitAmount - transactionFee;

  const fetchSavedCommissionScenarios = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/commission-scenarios/user/${userId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch saved commission scenarios");
      }

      const data = await response.json();
      setSavedCommissionScenarios(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load saved commission scenarios.");
    }
  };

  const toggleSavedCommissions = async () => {
    const nextValue = !showSavedCommissions;
    setShowSavedCommissions(nextValue);

    if (nextValue) {
      await fetchSavedCommissionScenarios();
    }
  };

  const openMLS = () => {
    window.open("https://www.flexmls.com/", "_blank", "noopener,noreferrer");
  };

  const handlePresentationChange = (e) => {
    const { name, value } = e.target;
    setPresentationForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchSavedPresentations = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/presentation-requests/user/${userId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch saved presentations");
      }

      const data = await response.json();
      setSavedPresentations(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load saved presentation requests.");
    }
  };

  const toggleSavedPresentations = async () => {
    const nextValue = !showSavedPresentations;
    setShowSavedPresentations(nextValue);

    if (nextValue) {
      await fetchSavedPresentations();
    }
  };

  const handlePresentationCreate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/presentation-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...presentationForm,
          submittedByUserId: userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save presentation request");
      }

      alert("Presentation request saved.");

      if (showSavedPresentations) {
        await fetchSavedPresentations();
      }

      setShowPresentationModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save presentation request.");
    }
  };

  const clearPresentationForm = () => {
    setPresentationForm({
      presentationType: "Buyer",
      clientName: "",
      propertyAddress: "",
      notes: "",
    });
  };

  const handleAiFormChange = (e) => {
    const { name, value } = e.target;
    setAiAssistantForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchSavedAiDrafts = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/ai-drafts/user/${userId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch saved AI drafts");
      }

      const data = await response.json();
      setSavedAiDrafts(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load saved AI drafts.");
    }
  };

  const toggleSavedAiDrafts = async () => {
    const nextValue = !showSavedAiDrafts;
    setShowSavedAiDrafts(nextValue);

    if (nextValue) {
      await fetchSavedAiDrafts();
    }
  };

  const loadAiTemplate = (taskType) => {
    const templates = {
      LISTING_DESCRIPTION: {
        taskType: "LISTING_DESCRIPTION",
        audience: "Buyer",
        tone: "Professional",
        propertyAddress: "",
        cityState: "",
        pricePoint: "",
        bedsBaths: "",
        propertyType: "",
        transactionStage: "Active",
        callToAction: "Schedule your private showing today.",
        context:
          "Highlight the most desirable features, lifestyle benefits, and buyer appeal.",
      },
      BUYER_FOLLOW_UP: {
        taskType: "BUYER_FOLLOW_UP",
        audience: "Buyer",
        tone: "Warm",
        propertyAddress: "",
        cityState: "",
        pricePoint: "",
        bedsBaths: "",
        propertyType: "",
        transactionStage: "After consultation",
        callToAction:
          "Let me know what questions you have and when you'd like to take the next step.",
        context:
          "Follow up after a consultation or showing and keep the message encouraging and clear.",
      },
      SELLER_UPDATE: {
        taskType: "SELLER_UPDATE",
        audience: "Seller",
        tone: "Professional",
        propertyAddress: "",
        cityState: "",
        pricePoint: "",
        bedsBaths: "",
        propertyType: "",
        transactionStage: "Active listing",
        callToAction: "Let's review the next best steps together.",
        context:
          "Provide a polished seller update about activity, feedback, and recommended next steps.",
      },
      SOCIAL_CAPTION: {
        taskType: "SOCIAL_CAPTION",
        audience: "General Audience",
        tone: "Confident",
        propertyAddress: "",
        cityState: "",
        pricePoint: "",
        bedsBaths: "",
        propertyType: "",
        transactionStage: "Marketing",
        callToAction: "Message me for details or to schedule a showing.",
        context:
          "Create a short caption that feels polished, engaging, and marketable.",
      },
      OPEN_HOUSE_PROMO: {
        taskType: "OPEN_HOUSE_PROMO",
        audience: "Buyer",
        tone: "Friendly",
        propertyAddress: "",
        cityState: "",
        pricePoint: "",
        bedsBaths: "",
        propertyType: "",
        transactionStage: "Open house",
        callToAction: "Stop by and see what makes this home stand out.",
        context:
          "Promote the home and invite foot traffic with a clear call to action.",
      },
      SHOWING_FEEDBACK_SUMMARY: {
        taskType: "SHOWING_FEEDBACK_SUMMARY",
        audience: "Seller",
        tone: "Direct",
        propertyAddress: "",
        cityState: "",
        pricePoint: "",
        bedsBaths: "",
        propertyType: "",
        transactionStage: "After showings",
        callToAction:
          "Let’s decide whether we should adjust positioning, presentation, or pricing.",
        context:
          "Summarize feedback clearly and professionally without sounding negative or defensive.",
      },
      PRICE_REDUCTION_CONVERSATION: {
        taskType: "PRICE_REDUCTION_CONVERSATION",
        audience: "Seller",
        tone: "Confident",
        propertyAddress: "",
        cityState: "",
        pricePoint: "",
        bedsBaths: "",
        propertyType: "",
        transactionStage: "Price review",
        callToAction:
          "I’d like to discuss a pricing adjustment that helps us attract stronger buyer attention.",
        context:
          "Frame a price reduction recommendation with market logic and professionalism.",
      },
      UNDER_CONTRACT_UPDATE: {
        taskType: "UNDER_CONTRACT_UPDATE",
        audience: "Buyer",
        tone: "Professional",
        propertyAddress: "",
        cityState: "",
        pricePoint: "",
        bedsBaths: "",
        propertyType: "",
        transactionStage: "Under contract",
        callToAction: "I’ll keep you updated each step of the way.",
        context:
          "Explain next steps clearly and calmly after a contract is accepted.",
      },
    };

    setAiAssistantForm(templates[taskType]);
    setAiOutput("");
  };

  const generateAiDraft = () => {
    const {
      taskType,
      audience,
      tone,
      propertyAddress,
      cityState,
      pricePoint,
      bedsBaths,
      propertyType,
      transactionStage,
      callToAction,
      context,
    } = aiAssistantForm;

    const propertyLine = [
      propertyAddress,
      cityState,
      pricePoint ? `Price Point: ${pricePoint}` : "",
      bedsBaths ? `Details: ${bedsBaths}` : "",
      propertyType ? `Property Type: ${propertyType}` : "",
    ]
      .filter(Boolean)
      .join(" | ");

    const toneLine = `Tone: ${tone}`;
    const audienceLine = `Audience: ${audience}`;
    const stageLine = transactionStage ? `Stage: ${transactionStage}` : "";

    let draft = "";

    if (taskType === "LISTING_DESCRIPTION") {
      draft = `Listing Description

Welcome to ${propertyAddress || "this beautiful home"}${
        cityState ? ` in ${cityState}` : ""
      }, a property that combines comfort, style, and everyday functionality. ${
        bedsBaths ? `Featuring ${bedsBaths.toLowerCase()}, ` : ""
      }this ${propertyType ? propertyType.toLowerCase() : "home"} offers the kind of space and layout buyers are looking for.

From the moment you arrive, this property is positioned to stand out with its livability, overall appeal, and potential to fit a variety of buyer needs. ${
        context ||
        "Highlight the best features here, including updates, layout, natural light, yard space, or community benefits."
      }

${pricePoint ? `Offered at ${pricePoint}, ` : ""}this is an opportunity buyers will want to take seriously. ${
        callToAction || "Schedule your private showing today."
      }

${audienceLine}
${toneLine}
${stageLine}`;
    } else if (taskType === "BUYER_FOLLOW_UP") {
      draft = `Buyer Follow-Up

Hi [Client Name],

Thank you again for taking the time to connect regarding ${
        propertyAddress || "the home we discussed"
      }. I wanted to follow up and make sure you feel clear on your options and next steps.

${
  context ||
  "If you are still interested, we can review the home in more detail, talk strategy, or line up the next showing opportunity."
}

${
  callToAction ||
  "Let me know what questions you have and when you'd like to take the next step."
}

Best,
[Your Name]

${propertyLine}
${audienceLine}
${toneLine}`;
    } else if (taskType === "SELLER_UPDATE") {
      draft = `Seller Update

Hi [Seller Name],

I wanted to give you a quick update on ${propertyAddress || "your listing"}${
        cityState ? ` in ${cityState}` : ""
      }.

${
  context ||
  "We have had activity and feedback that gives us a clearer picture of how buyers are responding to the home, the presentation, and the current pricing."
}

At this stage, my goal is to keep us positioned competitively while making thoughtful decisions based on actual market response. ${
        callToAction || "Let's review the next best steps together."
      }

${propertyLine}
${toneLine}
${stageLine}`;
    } else if (taskType === "SOCIAL_CAPTION") {
      draft = `Social Caption

${propertyAddress ? `${propertyAddress} is ` : "This home is "}one buyers need to see.${
        bedsBaths ? ` ${bedsBaths}.` : ""
      } ${
        context ||
        "With strong features, everyday functionality, and the kind of appeal buyers are looking for, this one deserves a spot on your list."
      } ${pricePoint ? `${pricePoint}. ` : ""}${
        callToAction || "Message me for details or to schedule a showing."
      }

${audienceLine}
${toneLine}`;
    } else if (taskType === "OPEN_HOUSE_PROMO") {
      draft = `Open House Promo

Join us at ${propertyAddress || "this featured property"}${
        cityState ? ` in ${cityState}` : ""
      } for an open house you do not want to miss.

${
  context ||
  "This home offers the layout, features, and overall feel that buyers have been searching for, making it worth seeing in person."
}

${pricePoint ? `Current price: ${pricePoint}. ` : ""}${
        callToAction || "Stop by and see what makes this home stand out."
      }

${propertyLine}
${audienceLine}
${toneLine}`;
    } else if (taskType === "SHOWING_FEEDBACK_SUMMARY") {
      draft = `Showing Feedback Summary

Here is a summary of buyer feedback for ${propertyAddress || "the property"}:

${
  context ||
  "Overall interest is present, but the feedback suggests there may be opportunities to improve positioning through presentation adjustments, pricing review, or stronger marketing emphasis."
}

The goal is not just activity, but activity that converts into stronger offers. ${
        callToAction ||
        "Let’s decide whether we should adjust positioning, presentation, or pricing."
      }

${propertyLine}
${audienceLine}
${toneLine}`;
    } else if (taskType === "PRICE_REDUCTION_CONVERSATION") {
      draft = `Price Reduction Conversation

I want to have a direct conversation about pricing for ${propertyAddress || "the property"}${
        cityState ? ` in ${cityState}` : ""
      }.

${
  context ||
  "Based on current market activity, buyer response, and how competing homes are positioned, a pricing adjustment may help us open the door to a stronger pool of buyers."
}

A reduction is not about giving the home away. It is about improving visibility, urgency, and the likelihood of securing serious interest. ${
        callToAction ||
        "I’d like to discuss a pricing adjustment that helps us attract stronger buyer attention."
      }

${propertyLine}
${audienceLine}
${toneLine}`;
    } else if (taskType === "UNDER_CONTRACT_UPDATE") {
      draft = `Under Contract Update

Great news — ${propertyAddress || "the property"} is under contract.

At this stage, ${
        context ||
        "we will move through the next steps of the transaction, which may include inspections, financing milestones, title work, and coordination between all parties."
      }

My role is to keep everything moving, communicate clearly, and help you stay informed throughout the process. ${
        callToAction || "I’ll keep you updated each step of the way."
      }

${propertyLine}
${audienceLine}
${toneLine}
${stageLine}`;
    } else {
      draft = `AI Draft

${
  context ||
  "Use the provided information to create a polished and professional real estate draft."
}

${propertyLine}
${audienceLine}
${toneLine}
${stageLine}`;
    }

    setAiOutput(draft);
  };

  const copyToClipboard = async (text, successMessage = "Copied to clipboard.") => {
    try {
      await navigator.clipboard.writeText(text);
      alert(successMessage);
    } catch (err) {
      console.error(err);
      alert("Failed to copy.");
    }
  };

  const clearCommissionCalculator = () => {
    setCommissionForm({
      salePrice: "",
      commissionPercent: "3",
      brokerSplitPercent: "0",
      referralPercent: "0",
      transactionFee: "0",
    });
  };

  const copyCommissionResults = async () => {
    const resultsText = `
Commission Calculator Results
Sale Price: ${formatCurrency(salePrice)}
Commission %: ${commissionPercent}%
Broker Split %: ${brokerSplitPercent}%
Referral %: ${referralPercent}%
Transaction Fee: ${formatCurrency(transactionFee)}

Gross Commission: ${formatCurrency(grossCommission)}
Referral Amount: ${formatCurrency(referralAmount)}
After Referral: ${formatCurrency(afterReferral)}
Broker Split: ${formatCurrency(brokerSplitAmount)}
Estimated Net: ${formatCurrency(estimatedNet)}
    `.trim();

    await copyToClipboard(resultsText, "Commission results copied.");
  };

  const saveCommissionScenario = async () => {
    const payload = {
      salePrice,
      commissionPercent,
      brokerSplitPercent,
      referralPercent,
      transactionFee,
      grossCommission,
      referralAmount,
      afterReferral,
      brokerSplitAmount,
      estimatedNet,
      submittedByUserId: userId,
    };

    try {
      const response = await fetch("http://localhost:8080/api/commission-scenarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save commission scenario");
      }

      alert("Commission scenario saved.");
      await fetchSavedCommissionScenarios();
    } catch (err) {
      console.error(err);
      alert("Failed to save commission scenario.");
    }
  };

  const clearAiAssistant = () => {
    setAiAssistantForm({
      taskType: "LISTING_DESCRIPTION",
      audience: "Buyer",
      tone: "Professional",
      propertyAddress: "",
      cityState: "",
      pricePoint: "",
      bedsBaths: "",
      propertyType: "",
      transactionStage: "",
      callToAction: "",
      context: "",
    });
    setAiOutput("");
  };

  const copyAiDraft = async () => {
    if (!aiOutput.trim()) {
      alert("There is no draft to copy yet.");
      return;
    }

    await copyToClipboard(aiOutput, "AI draft copied.");
  };

  const saveAiDraft = async () => {
    if (!aiOutput.trim()) {
      alert("Generate a draft first.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/ai-drafts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...aiAssistantForm,
          outputText: aiOutput,
          submittedByUserId: userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save AI draft");
      }

      alert("AI draft saved.");

      if (showSavedAiDrafts) {
        await fetchSavedAiDrafts();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save AI draft.");
    }
  };

  const previewPresentation = () => {
    const previewText = `
${presentationForm.presentationType} Presentation Preview

Client Name: ${presentationForm.clientName || "N/A"}
Property Address: ${presentationForm.propertyAddress || "N/A"}

Notes:
${presentationForm.notes || "No notes provided."}
    `.trim();

    alert(previewText);
  };

  const downloadPresentation = () => {
    const fileContent = `
${presentationForm.presentationType} Presentation

Client Name: ${presentationForm.clientName || ""}
Property Address: ${presentationForm.propertyAddress || ""}

Notes:
${presentationForm.notes || ""}
    `.trim();

    const blob = new Blob([fileContent], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${presentationForm.presentationType
      .replace(/\s+/g, "_")
      .toLowerCase()}_presentation.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const openPresentationBuilderPage = () => {
    window.location.href = "/presentation-builder";
  };

  if (loading) return <p style={loadingStyle}>Loading...</p>;
  if (error) return <p style={errorStyle}>{error}</p>;

  return (
    <div style={pageStyle}>
      <header style={headerStyle}>
        <div style={brandAreaStyle}>
          {!logoFailed ? (
            <img
              src="/logo.jpg"
              alt="TeamSync Logo"
              style={logoStyle}
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <div style={logoFallbackStyle}>TS</div>
          )}

          <div>
            <h1 style={helloStyle}>Hello, {userName}</h1>
            <p style={subTextStyle}>Welcome back to your dashboard</p>
          </div>
        </div>

        <div ref={profileMenuRef} style={profileWrapperStyle}>
          <button
            onClick={() => setShowProfileMenu((prev) => !prev)}
            style={profileButtonStyle}
          >
            <div style={avatarStyle}>
              {userName
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <div style={{ textAlign: "left" }}>
              <div style={profileNameStyle}>{userName}</div>
              <div style={profileRoleStyle}>{userRole}</div>
            </div>

            <span style={caretStyle}>▾</span>
          </button>

          {showProfileMenu && (
            <div style={profileMenuStyle}>
              <div style={profileMenuHeaderStyle}>
                <div style={profileMenuNameStyle}>{userName}</div>
                <div style={profileMenuEmailStyle}>{userEmail}</div>
              </div>

              <button style={menuItemStyle}>Profile Settings</button>
              <button
                style={menuItemStyle}
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/login";
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <div style={noticeBannerStyle}>
        If there is inaccurate information, requests, or updates needed please
        contact leadership or your assigned team lead.
      </div>

      <div style={summaryGridStyle}>
        <SummaryTile
          title="Goals"
          value={dashboard?.goals?.length || 0}
          subtitle="Active items"
        />
        <SummaryTile
          title="Commissions"
          value={dashboard?.commissions?.length || 0}
          subtitle="Tracked records"
        />
        <SummaryTile
          title="Events"
          value={dashboard?.events?.length || 0}
          subtitle="Upcoming items"
        />
        <SummaryTile
          title="Properties"
          value={dashboard?.properties?.length || 0}
          subtitle="Assigned records"
        />
      </div>

      <section style={toolsSectionStyle}>
        <div style={sectionTitleRowStyle}>
          <h2 style={sectionTitleStyle}>Quick Tools</h2>
          <p style={sectionSubTitleStyle}>
            Shortcuts and productivity tools for everyday work
          </p>
        </div>

        <div style={toolsGridStyle}>
          <ToolCard
            title="Commission Calculator"
            description="Estimate gross commission, referral, broker split, and net."
            buttonText="Open Calculator"
            onClick={() => setShowCommissionModal(true)}
          />

          <ToolCard
            title="MLS Access"
            description="Launch your MLS quickly without leaving your workflow."
            buttonText="Open MLS"
            onClick={openMLS}
          />

          <ToolCard
            title="Presentation Builder"
            description="Start a branded buyer or seller presentation request."
            buttonText="Open Builder"
            onClick={() => setShowPresentationModal(true)}
          />

          <ToolCard
            title="AI Assistant"
            description="Draft listing content, follow-ups, seller updates, and more."
            buttonText="Open Assistant"
            onClick={() => setShowAiModal(true)}
          />
        </div>
      </section>

      <div style={mainGridStyle}>
        <DashboardCard title="Goals">
          <ItemList data={dashboard?.goals} emptyText="No goals added yet." />
        </DashboardCard>

        <DashboardCard title="Commissions">
          <ItemList
            data={dashboard?.commissions}
            emptyText="No commissions available."
          />
        </DashboardCard>

        <DashboardCard title="Announcements">
          <ItemList
            data={dashboard?.announcements}
            emptyText="No announcements posted."
          />
        </DashboardCard>

        <DashboardCard title="Events">
          <ItemList data={dashboard?.events} emptyText="No upcoming events." />
        </DashboardCard>

        <DashboardCard title="Properties">
          <PropertyListUser
            properties={dashboard?.properties}
            emptyText="No properties assigned yet."
          />
        </DashboardCard>
      </div>

      {showCommissionModal && (
        <div style={modalOverlayStyle}>
          <div style={wideModalContentStyle}>
            <div style={modalHeaderStyle}>
              <h2 style={{ margin: 0 }}>Commission Calculator</h2>
              <button
                onClick={() => setShowCommissionModal(false)}
                style={closeButtonStyle}
              >
                ✕
              </button>
            </div>

            <div style={calculatorGridStyle}>
              <div style={{ display: "grid", gap: "12px" }}>
                <input
                  type="number"
                  name="salePrice"
                  value={commissionForm.salePrice}
                  onChange={handleCommissionChange}
                  placeholder="Sale Price"
                  style={inputStyle}
                />
                <input
                  type="number"
                  name="commissionPercent"
                  value={commissionForm.commissionPercent}
                  onChange={handleCommissionChange}
                  placeholder="Commission %"
                  style={inputStyle}
                />
                <input
                  type="number"
                  name="brokerSplitPercent"
                  value={commissionForm.brokerSplitPercent}
                  onChange={handleCommissionChange}
                  placeholder="Broker Split %"
                  style={inputStyle}
                />
                <input
                  type="number"
                  name="referralPercent"
                  value={commissionForm.referralPercent}
                  onChange={handleCommissionChange}
                  placeholder="Referral %"
                  style={inputStyle}
                />
                <input
                  type="number"
                  name="transactionFee"
                  value={commissionForm.transactionFee}
                  onChange={handleCommissionChange}
                  placeholder="Transaction Fee"
                  style={inputStyle}
                />
              </div>

              <div style={calculatorResultsStyle}>
                <ResultRow label="Gross Commission" value={grossCommission} />
                <ResultRow label="Referral Amount" value={referralAmount} />
                <ResultRow label="After Referral" value={afterReferral} />
                <ResultRow label="Broker Split" value={brokerSplitAmount} />
                <ResultRow label="Estimated Net" value={estimatedNet} bold />

                <div style={actionButtonRowStyle}>
                  <button
                    type="button"
                    style={primaryButtonStyle}
                    onClick={saveCommissionScenario}
                  >
                    Save Scenario
                  </button>

                  <button
                    type="button"
                    style={secondaryButtonStyle}
                    onClick={copyCommissionResults}
                  >
                    Copy Results
                  </button>

                  <button
                    type="button"
                    style={darkButtonStyle}
                    onClick={toggleSavedCommissions}
                  >
                    {showSavedCommissions ? "Hide Saved" : "View Saved"}
                  </button>

                  <button
                    type="button"
                    style={dangerButtonStyle}
                    onClick={clearCommissionCalculator}
                  >
                    Clear
                  </button>
                </div>

                {showSavedCommissions && (
                  <div style={savedSectionStyle}>
                    <h3 style={savedSectionTitleStyle}>Saved Commission Scenarios</h3>

                    {savedCommissionScenarios.length === 0 ? (
                      <p style={emptyTextStyle}>No saved commission scenarios yet.</p>
                    ) : (
                      <div style={{ display: "grid", gap: "10px" }}>
                        {savedCommissionScenarios.slice(0, 5).map((scenario) => {
                          const isExpanded = expandedCommissionId === scenario.id;

                          return (
                            <div key={scenario.id} style={savedItemCardStyle}>
                              <div style={savedSummaryRowStyle}>
                                <div>
                                  <div><strong>Sale Price:</strong> {formatCurrency(scenario.salePrice)}</div>
                                  <div><strong>Net:</strong> {formatCurrency(scenario.estimatedNet)}</div>
                                </div>

                                <button
                                  type="button"
                                  style={secondaryButtonStyle}
                                  onClick={() =>
                                    setExpandedCommissionId(isExpanded ? null : scenario.id)
                                  }
                                >
                                  {isExpanded ? "Collapse" : "Expand"}
                                </button>
                              </div>

                              {isExpanded && (
                                <div style={savedDetailSectionStyle}>
                                  <div><strong>Gross:</strong> {formatCurrency(scenario.grossCommission)}</div>
                                  <div><strong>Referral:</strong> {formatCurrency(scenario.referralAmount)}</div>
                                  <div><strong>After Referral:</strong> {formatCurrency(scenario.afterReferral)}</div>
                                  <div><strong>Broker Split:</strong> {formatCurrency(scenario.brokerSplitAmount)}</div>
                                  <div><strong>Created:</strong> {scenario.createdAt || "N/A"}</div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showPresentationModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={modalHeaderStyle}>
              <h2 style={{ margin: 0 }}>Presentation Builder</h2>
              <button
                onClick={() => setShowPresentationModal(false)}
                style={closeButtonStyle}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePresentationCreate} style={{ display: "grid", gap: "12px" }}>
              <select
                name="presentationType"
                value={presentationForm.presentationType}
                onChange={handlePresentationChange}
                style={inputStyle}
              >
                <option value="Buyer">Buyer Presentation</option>
                <option value="Seller">Seller Presentation</option>
                <option value="Listing">Listing Presentation</option>
                <option value="CMA">CMA Presentation</option>
              </select>

              <input
                name="clientName"
                value={presentationForm.clientName}
                onChange={handlePresentationChange}
                placeholder="Client Name"
                style={inputStyle}
              />

              <input
                name="propertyAddress"
                value={presentationForm.propertyAddress}
                onChange={handlePresentationChange}
                placeholder="Property Address"
                style={inputStyle}
              />

              <textarea
                name="notes"
                value={presentationForm.notes}
                onChange={handlePresentationChange}
                placeholder="Notes / key talking points"
                rows="5"
                style={textAreaStyle}
              />

              <div style={actionButtonRowStyle}>
                <button type="submit" style={primaryButtonStyle}>
                  Save Presentation Request
                </button>

                <button
                  type="button"
                  style={secondaryButtonStyle}
                  onClick={previewPresentation}
                >
                  Preview
                </button>

                <button
                  type="button"
                  style={secondaryButtonStyle}
                  onClick={downloadPresentation}
                >
                  Download
                </button>

                <button
                  type="button"
                  style={darkButtonStyle}
                  onClick={toggleSavedPresentations}
                >
                  {showSavedPresentations ? "Hide Saved" : "View Saved"}
                </button>

                <button
                  type="button"
                  style={darkButtonStyle}
                  onClick={openPresentationBuilderPage}
                >
                  Open Builder Page
                </button>

                <button
                  type="button"
                  style={dangerButtonStyle}
                  onClick={clearPresentationForm}
                >
                  Clear
                </button>
              </div>

              {showSavedPresentations && (
                <div style={savedSectionStyle}>
                  <h3 style={savedSectionTitleStyle}>Saved Presentation Requests</h3>

                  {savedPresentations.length === 0 ? (
                    <p style={emptyTextStyle}>No saved presentation requests yet.</p>
                  ) : (
                    <div style={{ display: "grid", gap: "10px" }}>
                      {savedPresentations.slice(0, 5).map((presentation) => {
                        const isExpanded = expandedPresentationId === presentation.id;

                        return (
                          <div key={presentation.id} style={savedItemCardStyle}>
                            <div style={savedSummaryRowStyle}>
                              <div>
                                <div><strong>Type:</strong> {presentation.presentationType}</div>
                                <div><strong>Client:</strong> {presentation.clientName || "N/A"}</div>
                              </div>

                              <button
                                type="button"
                                style={secondaryButtonStyle}
                                onClick={() =>
                                  setExpandedPresentationId(isExpanded ? null : presentation.id)
                                }
                              >
                                {isExpanded ? "Collapse" : "Expand"}
                              </button>
                            </div>

                            {isExpanded && (
                              <div style={savedDetailSectionStyle}>
                                <div><strong>Property:</strong> {presentation.propertyAddress || "N/A"}</div>
                                <div><strong>Created:</strong> {presentation.createdAt || "N/A"}</div>
                                <div style={savedDraftPreviewStyle}>
                                  {presentation.notes || "No notes provided."}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {showAiModal && (
        <div style={modalOverlayStyle}>
          <div style={wideModalContentStyle}>
            <div style={modalHeaderStyle}>
              <h2 style={{ margin: 0 }}>AI Assistant</h2>
              <button
                onClick={() => setShowAiModal(false)}
                style={closeButtonStyle}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "grid", gap: "14px" }}>
              <div style={aiPromptButtonsStyle}>
                <button
                  type="button"
                  style={chipButtonStyle}
                  onClick={() => loadAiTemplate("LISTING_DESCRIPTION")}
                >
                  Listing Description
                </button>
                <button
                  type="button"
                  style={chipButtonStyle}
                  onClick={() => loadAiTemplate("BUYER_FOLLOW_UP")}
                >
                  Buyer Follow-Up
                </button>
                <button
                  type="button"
                  style={chipButtonStyle}
                  onClick={() => loadAiTemplate("SELLER_UPDATE")}
                >
                  Seller Update
                </button>
                <button
                  type="button"
                  style={chipButtonStyle}
                  onClick={() => loadAiTemplate("SOCIAL_CAPTION")}
                >
                  Social Caption
                </button>
                <button
                  type="button"
                  style={chipButtonStyle}
                  onClick={() => loadAiTemplate("OPEN_HOUSE_PROMO")}
                >
                  Open House Promo
                </button>
                <button
                  type="button"
                  style={chipButtonStyle}
                  onClick={() => loadAiTemplate("SHOWING_FEEDBACK_SUMMARY")}
                >
                  Showing Feedback
                </button>
                <button
                  type="button"
                  style={chipButtonStyle}
                  onClick={() => loadAiTemplate("PRICE_REDUCTION_CONVERSATION")}
                >
                  Price Reduction
                </button>
                <button
                  type="button"
                  style={chipButtonStyle}
                  onClick={() => loadAiTemplate("UNDER_CONTRACT_UPDATE")}
                >
                  Under Contract
                </button>
              </div>

              <div style={aiFormGridStyle}>
                <select
                  name="taskType"
                  value={aiAssistantForm.taskType}
                  onChange={handleAiFormChange}
                  style={inputStyle}
                >
                  <option value="LISTING_DESCRIPTION">Listing Description</option>
                  <option value="BUYER_FOLLOW_UP">Buyer Follow-Up</option>
                  <option value="SELLER_UPDATE">Seller Update</option>
                  <option value="SOCIAL_CAPTION">Social Caption</option>
                  <option value="OPEN_HOUSE_PROMO">Open House Promo</option>
                  <option value="SHOWING_FEEDBACK_SUMMARY">
                    Showing Feedback Summary
                  </option>
                  <option value="PRICE_REDUCTION_CONVERSATION">
                    Price Reduction Conversation
                  </option>
                  <option value="UNDER_CONTRACT_UPDATE">
                    Under Contract Update
                  </option>
                </select>

                <select
                  name="audience"
                  value={aiAssistantForm.audience}
                  onChange={handleAiFormChange}
                  style={inputStyle}
                >
                  <option value="Buyer">Buyer</option>
                  <option value="Seller">Seller</option>
                  <option value="Investor">Investor</option>
                  <option value="General Audience">General Audience</option>
                  <option value="Past Client">Past Client</option>
                </select>

                <select
                  name="tone"
                  value={aiAssistantForm.tone}
                  onChange={handleAiFormChange}
                  style={inputStyle}
                >
                  <option value="Professional">Professional</option>
                  <option value="Warm">Warm</option>
                  <option value="Confident">Confident</option>
                  <option value="Friendly">Friendly</option>
                  <option value="Direct">Direct</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Educational">Educational</option>
                </select>

                <input
                  name="propertyAddress"
                  value={aiAssistantForm.propertyAddress}
                  onChange={handleAiFormChange}
                  placeholder="Property Address"
                  style={inputStyle}
                />

                <input
                  name="cityState"
                  value={aiAssistantForm.cityState}
                  onChange={handleAiFormChange}
                  placeholder="City, State"
                  style={inputStyle}
                />

                <input
                  name="pricePoint"
                  value={aiAssistantForm.pricePoint}
                  onChange={handleAiFormChange}
                  placeholder="Price Point"
                  style={inputStyle}
                />

                <input
                  name="bedsBaths"
                  value={aiAssistantForm.bedsBaths}
                  onChange={handleAiFormChange}
                  placeholder="Beds / Baths / Sq Ft"
                  style={inputStyle}
                />

                <input
                  name="propertyType"
                  value={aiAssistantForm.propertyType}
                  onChange={handleAiFormChange}
                  placeholder="Property Type"
                  style={inputStyle}
                />

                <input
                  name="transactionStage"
                  value={aiAssistantForm.transactionStage}
                  onChange={handleAiFormChange}
                  placeholder="Transaction Stage"
                  style={inputStyle}
                />

                <input
                  name="callToAction"
                  value={aiAssistantForm.callToAction}
                  onChange={handleAiFormChange}
                  placeholder="Desired Call to Action"
                  style={inputStyle}
                />
              </div>

              <textarea
                name="context"
                value={aiAssistantForm.context}
                onChange={handleAiFormChange}
                rows="6"
                style={textAreaStyle}
                placeholder="Add details about the property, client situation, objections, goals, urgency, upgrades, neighborhood, financing concerns, feedback, or anything else the draft should reflect."
              />

              <div style={actionButtonRowStyle}>
                <button
                  type="button"
                  style={primaryButtonStyle}
                  onClick={generateAiDraft}
                >
                  Generate Draft
                </button>

                <button
                  type="button"
                  style={secondaryButtonStyle}
                  onClick={copyAiDraft}
                >
                  Copy Draft
                </button>

                <button
                  type="button"
                  style={secondaryButtonStyle}
                  onClick={saveAiDraft}
                >
                  Save Draft
                </button>

                <button
                  type="button"
                  style={darkButtonStyle}
                  onClick={toggleSavedAiDrafts}
                >
                  {showSavedAiDrafts ? "Hide Saved" : "View Saved"}
                </button>

                <button
                  type="button"
                  style={dangerButtonStyle}
                  onClick={clearAiAssistant}
                >
                  Clear
                </button>
              </div>

              <textarea
                value={aiOutput}
                onChange={(e) => setAiOutput(e.target.value)}
                rows="14"
                style={textAreaStyle}
                placeholder="Your AI-generated draft will appear here..."
              />

              {showSavedAiDrafts && (
                <div style={savedSectionStyle}>
                  <h3 style={savedSectionTitleStyle}>Saved AI Drafts</h3>

                  {savedAiDrafts.length === 0 ? (
                    <p style={emptyTextStyle}>No saved AI drafts yet.</p>
                  ) : (
                    <div style={{ display: "grid", gap: "10px" }}>
                      {savedAiDrafts.slice(0, 5).map((draft) => {
                        const isExpanded = expandedAiDraftId === draft.id;

                        return (
                          <div key={draft.id} style={savedItemCardStyle}>
                            <div style={savedSummaryRowStyle}>
                              <div>
                                <div><strong>Task:</strong> {draft.taskType}</div>
                                <div><strong>Property:</strong> {draft.propertyAddress || "N/A"}</div>
                              </div>

                              <button
                                type="button"
                                style={secondaryButtonStyle}
                                onClick={() =>
                                  setExpandedAiDraftId(isExpanded ? null : draft.id)
                                }
                              >
                                {isExpanded ? "Collapse" : "Expand"}
                              </button>
                            </div>

                            {isExpanded && (
                              <div style={savedDetailSectionStyle}>
                                <div><strong>Tone:</strong> {draft.tone}</div>
                                <div><strong>Audience:</strong> {draft.audience}</div>
                                <div><strong>Created:</strong> {draft.createdAt || "N/A"}</div>
                                <div style={savedDraftPreviewStyle}>
                                  {draft.outputText || "No preview available."}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardCard({ title, children }) {
  return (
    <section style={cardStyle}>
      <div style={cardHeaderStyle}>
        <h2 style={cardTitleStyle}>{title}</h2>
      </div>
      <div>{children}</div>
    </section>
  );
}

function ItemList({ data, emptyText }) {
  if (!data || data.length === 0) {
    return <p style={emptyTextStyle}>{emptyText}</p>;
  }

  return (
    <div style={{ display: "grid", gap: "10px" }}>
      {data.map((item) => (
        <div key={item.id} style={listItemStyle}>
          <div style={listItemTitleStyle}>
            {item.title || item.address || item.transactionName || "Untitled"}
          </div>

          {item.description && (
            <div style={listItemSubStyle}>{item.description}</div>
          )}

          {item.content && (
            <div style={listItemSubStyle}>{item.content}</div>
          )}

          {item.location && (
            <div style={listItemMetaStyle}>{item.location}</div>
          )}

          {item.eventDate && (
            <div style={listItemMetaStyle}>{item.eventDate}</div>
          )}
        </div>
      ))}
    </div>
  );
}

function SummaryTile({ title, value, subtitle }) {
  return (
    <div style={summaryTileStyle}>
      <div style={summaryValueStyle}>{value}</div>
      <div style={summaryTitleStyle}>{title}</div>
      <div style={summarySubtitleStyle}>{subtitle}</div>
    </div>
  );
}

function ToolCard({ title, description, buttonText, onClick }) {
  return (
    <div style={toolCardStyle}>
      <div>
        <div style={toolCardTitleStyle}>{title}</div>
        <div style={toolCardDescStyle}>{description}</div>
      </div>
      <button style={toolButtonStyle} onClick={onClick}>
        {buttonText}
      </button>
    </div>
  );
}

function ResultRow({ label, value, bold = false }) {
  return (
    <div style={resultRowStyle}>
      <span style={bold ? resultLabelBoldStyle : resultLabelStyle}>{label}</span>
      <span style={bold ? resultValueBoldStyle : resultValueStyle}>
        {formatCurrency(value)}
      </span>
    </div>
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value) || 0);
}

const pageStyle = {
  minHeight: "100vh",
  background: "#f4f7fb",
  padding: "24px",
  fontFamily: "Arial, sans-serif",
  color: "#1f2937",
};

const headerStyle = {
  background: "#ffffff",
  borderRadius: "16px",
  padding: "20px 24px",
  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  flexWrap: "wrap",
};

const brandAreaStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const logoStyle = {
  width: "64px",
  height: "64px",
  objectFit: "contain",
  borderRadius: "12px",
  background: "#ffffff",
};

const logoFallbackStyle = {
  width: "64px",
  height: "64px",
  borderRadius: "12px",
  background: "#1e3a8a",
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "700",
  fontSize: "22px",
};

const helloStyle = {
  margin: 0,
  fontSize: "32px",
  fontWeight: "700",
};

const subTextStyle = {
  margin: "6px 0 0 0",
  color: "#6b7280",
  fontSize: "14px",
};

const noticeBannerStyle = {
  marginTop: "20px",
  marginBottom: "20px",
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
  color: "#1e3a8a",
  padding: "14px 16px",
  borderRadius: "12px",
  fontSize: "14px",
  lineHeight: 1.5,
};

const profileWrapperStyle = {
  position: "relative",
};

const profileButtonStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  border: "1px solid #e5e7eb",
  background: "#f9fafb",
  borderRadius: "14px",
  padding: "10px 14px",
  cursor: "pointer",
};

const avatarStyle = {
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  background: "#2563eb",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "700",
};

const profileNameStyle = {
  fontWeight: "700",
  fontSize: "14px",
};

const profileRoleStyle = {
  fontSize: "12px",
  color: "#6b7280",
};

const caretStyle = {
  color: "#6b7280",
  fontSize: "14px",
};

const profileMenuStyle = {
  position: "absolute",
  right: 0,
  top: "110%",
  width: "240px",
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "14px",
  boxShadow: "0 12px 28px rgba(15, 23, 42, 0.12)",
  overflow: "hidden",
  zIndex: 10,
};

const profileMenuHeaderStyle = {
  padding: "14px 16px",
  borderBottom: "1px solid #f1f5f9",
};

const profileMenuNameStyle = {
  fontWeight: "700",
  fontSize: "14px",
};

const profileMenuEmailStyle = {
  fontSize: "12px",
  color: "#6b7280",
  marginTop: "4px",
};

const menuItemStyle = {
  width: "100%",
  textAlign: "left",
  background: "#ffffff",
  border: "none",
  padding: "14px 16px",
  cursor: "pointer",
  fontSize: "14px",
};

const primaryButtonStyle = {
  border: "none",
  background: "#1d4ed8",
  color: "#ffffff",
  padding: "12px 18px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "600",
};

const secondaryButtonStyle = {
  border: "none",
  background: "#0f766e",
  color: "#ffffff",
  padding: "12px 18px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "600",
};

const dangerButtonStyle = {
  border: "none",
  background: "#b91c1c",
  color: "#ffffff",
  padding: "12px 18px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "600",
};

const darkButtonStyle = {
  border: "none",
  background: "#111827",
  color: "#ffffff",
  padding: "12px 18px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "600",
};

const summaryGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "16px",
  marginBottom: "20px",
};

const summaryTileStyle = {
  background: "#ffffff",
  borderRadius: "16px",
  padding: "18px",
  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
};

const summaryValueStyle = {
  fontSize: "28px",
  fontWeight: "700",
  color: "#111827",
};

const summaryTitleStyle = {
  marginTop: "8px",
  fontWeight: "600",
};

const summarySubtitleStyle = {
  marginTop: "4px",
  fontSize: "12px",
  color: "#6b7280",
};

const toolsSectionStyle = {
  marginBottom: "22px",
};

const sectionTitleRowStyle = {
  marginBottom: "12px",
};

const sectionTitleStyle = {
  margin: 0,
  fontSize: "24px",
  fontWeight: "700",
};

const sectionSubTitleStyle = {
  margin: "6px 0 0 0",
  fontSize: "13px",
  color: "#6b7280",
};

const toolsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "16px",
};

const toolCardStyle = {
  background: "#ffffff",
  borderRadius: "16px",
  padding: "18px",
  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: "16px",
  minHeight: "170px",
};

const toolCardTitleStyle = {
  fontSize: "18px",
  fontWeight: "700",
  marginBottom: "8px",
};

const toolCardDescStyle = {
  fontSize: "14px",
  color: "#6b7280",
  lineHeight: 1.4,
};

const toolButtonStyle = {
  border: "none",
  background: "#111827",
  color: "#ffffff",
  padding: "10px 14px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
};

const mainGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "18px",
};

const cardStyle = {
  background: "#ffffff",
  borderRadius: "16px",
  padding: "18px",
  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
};

const cardHeaderStyle = {
  marginBottom: "14px",
};

const cardTitleStyle = {
  margin: 0,
  fontSize: "24px",
  fontWeight: "700",
};

const listItemStyle = {
  padding: "12px",
  borderRadius: "12px",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
};

const listItemTitleStyle = {
  fontWeight: "600",
  marginBottom: "4px",
};

const listItemSubStyle = {
  fontSize: "13px",
  color: "#475569",
};

const listItemMetaStyle = {
  marginTop: "6px",
  fontSize: "12px",
  color: "#64748b",
};

const emptyTextStyle = {
  margin: 0,
  color: "#6b7280",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  boxSizing: "border-box",
};

const textAreaStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  resize: "vertical",
  boxSizing: "border-box",
};

const modalOverlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(15, 23, 42, 0.45)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  zIndex: 1000,
};

const modalContentStyle = {
  width: "100%",
  maxWidth: "520px",
  background: "#ffffff",
  borderRadius: "16px",
  padding: "20px",
  boxShadow: "0 20px 50px rgba(15, 23, 42, 0.2)",
};

const wideModalContentStyle = {
  width: "100%",
  maxWidth: "760px",
  background: "#ffffff",
  borderRadius: "16px",
  padding: "20px",
  boxShadow: "0 20px 50px rgba(15, 23, 42, 0.2)",
};

const modalHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
};

const closeButtonStyle = {
  border: "none",
  background: "transparent",
  fontSize: "20px",
  cursor: "pointer",
};

const calculatorGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "18px",
};

const calculatorResultsStyle = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "14px",
  padding: "16px",
  display: "grid",
  gap: "12px",
  alignContent: "start",
};

const resultRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
};

const resultLabelStyle = {
  color: "#475569",
  fontSize: "14px",
};

const resultLabelBoldStyle = {
  color: "#111827",
  fontSize: "15px",
  fontWeight: "700",
};

const resultValueStyle = {
  color: "#111827",
  fontSize: "14px",
};

const resultValueBoldStyle = {
  color: "#111827",
  fontSize: "16px",
  fontWeight: "700",
};

const aiPromptButtonsStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
};

const chipButtonStyle = {
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#0f172a",
  padding: "8px 12px",
  borderRadius: "999px",
  cursor: "pointer",
  fontSize: "13px",
};

const aiFormGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "12px",
};

const actionButtonRowStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  marginTop: "8px",
};

const savedSectionStyle = {
  marginTop: "18px",
  paddingTop: "14px",
  borderTop: "1px solid #e2e8f0",
  display: "grid",
  gap: "12px",
};

const savedSectionTitleStyle = {
  margin: 0,
  fontSize: "18px",
  fontWeight: "700",
};

const savedItemCardStyle = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "12px",
  display: "grid",
  gap: "6px",
};

const savedDraftPreviewStyle = {
  marginTop: "6px",
  fontSize: "13px",
  color: "#475569",
  whiteSpace: "pre-wrap",
};

const savedSummaryRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "12px",
};

const savedDetailSectionStyle = {
  marginTop: "10px",
  paddingTop: "10px",
  borderTop: "1px solid #e2e8f0",
  display: "grid",
  gap: "6px",
};

const loadingStyle = {
  padding: "24px",
  fontFamily: "Arial, sans-serif",
};

const errorStyle = {
  padding: "24px",
  color: "#b91c1c",
  fontFamily: "Arial, sans-serif",
};

export default UserDashboard;