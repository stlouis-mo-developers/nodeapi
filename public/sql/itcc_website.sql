
/****** Object:  Table [dbo].[ITCC_Website]    Script Date: 2/27/2022 4:33:34 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[ITCC_Website](
	[ITCC_WebsiteID] [int] IDENTITY(1,1) NOT NULL,
	[ITCC_WebsiteTypeID] [int] NOT NULL,
	[Title] [nvarchar](384) NOT NULL,
	[Slug] [nvarchar](256) NOT NULL,
	[Url] [nvarchar](256) NOT NULL,
	[PageRank] [int] NULL,
	[Description] [nvarchar](max) NULL,
	[ITCC_StatusID] [int] NOT NULL,
	[RssUrl] [varchar](768) NULL,
	[ShareThis] [bit] NULL,
	[SkipThis] [int] NULL,
	[ApplicationId] [uniqueidentifier] NULL,
	[MoreInformationUrl] [nvarchar](384) NULL,
	[Email_FeedblitzID] [nvarchar](64) NULL,
	[BlogUrl] [nvarchar](128) NULL,
	[ForumUrl] [nvarchar](128) NULL,
	[ShortUrl] [nvarchar](64) NULL,
	[Note] [nvarchar](max) NULL,
	[OutboundContactCount] [int] NULL,
	[OutboundContactDate] [datetime] NULL,
	[InboundContactCount] [int] NULL,
	[InboundContactDate] [datetime] NULL,
	[LogoUrl] [nvarchar](256) NOT NULL,
	[ThemeName] [nvarchar](64) NOT NULL,
	[HomePage] [nvarchar](64) NOT NULL,
	[LoginPage] [nvarchar](64) NOT NULL,
	[EmailAddress] [nvarchar](max) NULL,
	[TwitterAddress] [nvarchar](max) NULL,
	[FacebookAddress] [nvarchar](max) NULL,
	[LinkedinAddress] [nvarchar](max) NULL,
	[GoogleplusAddress] [nvarchar](max) NULL,
	[YoutubeAddress] [nvarchar](max) NULL,
	[BusinessAddress] [nvarchar](max) NULL,
	[AltWebAddress] [nvarchar](max) NULL,
	[PhoneNumber] [nvarchar](max) NULL,
	[FaxNumber] [nvarchar](max) NULL,
	[BusinessName] [nvarchar](128) NULL,
	[PortfolioUrl] [nvarchar](128) NULL,
	[CreateDate] [datetime] NULL,
	[CreateAccountID] [int] NULL,
	[ModifyDate] [datetime] NULL,
	[ModifyAccountID] [int] NULL,
	[PrivateKeyID] [uniqueidentifier] NULL,
	[RouteType] [nvarchar](32) NULL,
	[Header] [nvarchar](max) NULL,
	[Footer] [nvarchar](max) NULL,
 CONSTRAINT [PK_Website] PRIMARY KEY CLUSTERED 
(
	[ITCC_WebsiteID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [IX_Website_Url] UNIQUE NONCLUSTERED 
(
	[Url] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[ITCC_Website] ADD  DEFAULT ('') FOR [Slug]
GO

ALTER TABLE [dbo].[ITCC_Website] ADD  CONSTRAINT [ITCC_Website_Default_ShareThis]  DEFAULT ((0)) FOR [ShareThis]
GO

ALTER TABLE [dbo].[ITCC_Website] ADD  CONSTRAINT [ITCC_Website_Default_SkipThis]  DEFAULT ((0)) FOR [SkipThis]
GO

ALTER TABLE [dbo].[ITCC_Website] ADD  DEFAULT ((0)) FOR [OutboundContactCount]
GO

ALTER TABLE [dbo].[ITCC_Website] ADD  DEFAULT ((0)) FOR [InboundContactCount]
GO

ALTER TABLE [dbo].[ITCC_Website] ADD  DEFAULT ('~/content/themes/metronic/img/logo_data_mining_app.png') FOR [LogoUrl]
GO

ALTER TABLE [dbo].[ITCC_Website] ADD  DEFAULT ('Metronic') FOR [ThemeName]
GO

ALTER TABLE [dbo].[ITCC_Website] ADD  DEFAULT ('') FOR [HomePage]
GO

ALTER TABLE [dbo].[ITCC_Website] ADD  DEFAULT ('Login') FOR [LoginPage]
GO

ALTER TABLE [dbo].[ITCC_Website] ADD  DEFAULT (getdate()) FOR [CreateDate]
GO

ALTER TABLE [dbo].[ITCC_Website] ADD  DEFAULT (getdate()) FOR [ModifyDate]
GO

ALTER TABLE [dbo].[ITCC_Website] ADD  DEFAULT (newid()) FOR [PrivateKeyID]
GO

ALTER TABLE [dbo].[ITCC_Website] ADD  DEFAULT ('News') FOR [RouteType]
GO


