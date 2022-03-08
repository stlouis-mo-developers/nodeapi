
/****** Object:  Table [dbo].[ITCC_Image]    Script Date: 2/27/2022 4:35:13 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[ITCC_Image](
	[ITCC_ImageID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](256) NOT NULL,
	[Description] [nvarchar](max) NOT NULL,
	[ITCC_WebsiteID] [int] NOT NULL,
	[FileGroup] [nvarchar](256) NOT NULL,
	[Height] [int] NULL,
	[Width] [int] NULL,
	[FilePath] [nvarchar](384) NULL,
	[SourceUrl] [nvarchar](384) NULL,
	[PublishUrl] [nvarchar](384) NULL,
	[EntityTypeName] [nvarchar](64) NULL,
	[EntityTypeKeyID] [nvarchar](64) NULL,
	[CreateDate] [datetime] NOT NULL,
	[CreateUserID] [int] NOT NULL,
	[UpdateDate] [datetime] NOT NULL,
	[UpdateUserID] [int] NOT NULL,
	[Title] [nvarchar](256) NULL,
	[Slug] [nvarchar](256) NULL,
	[Category] [nvarchar](256) NULL,
	[Tags] [nvarchar](max) NULL,
	[IsActive] [bit] NOT NULL,
	[ImageHeight] [int] NULL,
	[ImageWidth] [int] NULL,
	[ImageTitle] [nvarchar](384) NULL,
	[ImageCaption] [nvarchar](384) NULL,
	[SourceImageUrl] [varchar](768) NULL,
	[SmallImageUrl] [varchar](768) NULL,
	[ImageAlignmentTypeID] [nchar](10) NULL,
	[CreateAccountID] [int] NULL,
	[ModifyDate] [datetime] NULL,
	[ModifyAccountID] [int] NULL,
	[MediumImageUrl] [varchar](768) NULL,
	[LargeImageUrl] [varchar](768) NULL,
	[XLargeImageUrl] [varchar](768) NULL,
	[XXLargeImageUrl] [varchar](768) NULL,
	[X960_360ImageUrl] [varchar](768) NULL,
	[X300_300ImageUrl] [varchar](768) NULL,
	[ITCC_PostImageID] [int] NULL,
 CONSTRAINT [PK_ITCC_Image] PRIMARY KEY CLUSTERED 
(
	[ITCC_ImageID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[ITCC_Image] ADD  CONSTRAINT [DF_ITCC_Image_CreateDate]  DEFAULT (getdate()) FOR [CreateDate]
GO

ALTER TABLE [dbo].[ITCC_Image] ADD  CONSTRAINT [DF_ITCC_Image_UpdateDate]  DEFAULT (getdate()) FOR [UpdateDate]
GO

ALTER TABLE [dbo].[ITCC_Image] ADD  DEFAULT ((1)) FOR [IsActive]
GO


