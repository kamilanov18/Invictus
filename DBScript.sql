USE [master]
GO
/****** Object:  Database [InvictusDB]    Script Date: 7/7/2021 2:17:06 PM ******/
CREATE DATABASE [InvictusDB]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'InvictusDB', FILENAME = N'C:\Users\kamilanov18\InvictusDB.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'InvictusDB_log', FILENAME = N'C:\Users\kamilanov18\InvictusDB_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
GO
ALTER DATABASE [InvictusDB] SET COMPATIBILITY_LEVEL = 130
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [InvictusDB].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [InvictusDB] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [InvictusDB] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [InvictusDB] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [InvictusDB] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [InvictusDB] SET ARITHABORT OFF 
GO
ALTER DATABASE [InvictusDB] SET AUTO_CLOSE ON 
GO
ALTER DATABASE [InvictusDB] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [InvictusDB] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [InvictusDB] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [InvictusDB] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [InvictusDB] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [InvictusDB] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [InvictusDB] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [InvictusDB] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [InvictusDB] SET  ENABLE_BROKER 
GO
ALTER DATABASE [InvictusDB] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [InvictusDB] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [InvictusDB] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [InvictusDB] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [InvictusDB] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [InvictusDB] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [InvictusDB] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [InvictusDB] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [InvictusDB] SET  MULTI_USER 
GO
ALTER DATABASE [InvictusDB] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [InvictusDB] SET DB_CHAINING OFF 
GO
ALTER DATABASE [InvictusDB] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [InvictusDB] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [InvictusDB] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [InvictusDB] SET QUERY_STORE = OFF
GO
USE [InvictusDB]
GO
ALTER DATABASE SCOPED CONFIGURATION SET LEGACY_CARDINALITY_ESTIMATION = OFF;
GO
ALTER DATABASE SCOPED CONFIGURATION SET MAXDOP = 0;
GO
ALTER DATABASE SCOPED CONFIGURATION SET PARAMETER_SNIFFING = ON;
GO
ALTER DATABASE SCOPED CONFIGURATION SET QUERY_OPTIMIZER_HOTFIXES = OFF;
GO
USE [InvictusDB]
GO
/****** Object:  Table [dbo].[Projects]    Script Date: 7/7/2021 2:17:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Projects](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Title] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](250) NOT NULL,
	[DateOfCreation] [datetime] NOT NULL,
	[CreatorId] [int] NOT NULL,
	[DateOfLastChange] [datetime] NOT NULL,
	[LatestChangeUserId] [int] NOT NULL,
 CONSTRAINT [PK_Projects] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Tasks]    Script Date: 7/7/2021 2:17:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Tasks](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ProjectId] [int] NOT NULL,
	[AsigneeId] [int] NOT NULL,
	[Title] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](250) NOT NULL,
	[Status] [tinyint] NOT NULL,
	[DateOfCreation] [datetime] NOT NULL,
	[CreatorId] [int] NOT NULL,
	[DateOfLatestChange] [datetime] NOT NULL,
	[LatestChangeUserId] [int] NOT NULL,
 CONSTRAINT [PK_Tasks] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Teams]    Script Date: 7/7/2021 2:17:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Teams](
	[Id] [int] NOT NULL,
	[Title] [nvarchar](50) NOT NULL,
	[DateOfCreation] [datetime] NOT NULL,
	[CreatorId] [int] NOT NULL,
	[DateOfLastChange] [datetime] NOT NULL,
	[LatestChangeUserId] [int] NOT NULL,
 CONSTRAINT [PK_Team] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TeamsProjects]    Script Date: 7/7/2021 2:17:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TeamsProjects](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[TeamId] [int] NOT NULL,
	[ProjectId] [int] NOT NULL,
 CONSTRAINT [PK_TeamsProjects] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 7/7/2021 2:17:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Username] [nvarchar](50) NOT NULL,
	[Password] [nvarchar](50) NOT NULL,
	[FirstName] [nvarchar](50) NOT NULL,
	[LastName] [nvarchar](50) NOT NULL,
	[DateOfCreation] [datetimeoffset](7) NOT NULL,
	[CreatorId] [int] NOT NULL,
	[DateOfLastChange] [datetime] NOT NULL,
	[LatestChangeUserId] [int] NOT NULL,
	[IsAdmin] [bit] NOT NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UsersTeams]    Script Date: 7/7/2021 2:17:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UsersTeams](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[TeamId] [int] NOT NULL,
 CONSTRAINT [PK_UsersTeams] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Workslogs]    Script Date: 7/7/2021 2:17:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Workslogs](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[TaskId] [int] NOT NULL,
	[Time] [smallint] NOT NULL,
	[CreatorId] [int] NOT NULL,
 CONSTRAINT [PK_Workslogs] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Projects] ADD  CONSTRAINT [DF_Projects_DateOfCreation]  DEFAULT (getdate()) FOR [DateOfCreation]
GO
ALTER TABLE [dbo].[Tasks] ADD  CONSTRAINT [DF_Tasks_DateOfCreation]  DEFAULT (getdate()) FOR [DateOfCreation]
GO
ALTER TABLE [dbo].[Teams] ADD  CONSTRAINT [DF_Team_DateOfCreation]  DEFAULT (getdate()) FOR [DateOfCreation]
GO
ALTER TABLE [dbo].[Users] ADD  CONSTRAINT [DF_Users_DateOfCreation]  DEFAULT (getdate()) FOR [DateOfCreation]
GO
ALTER TABLE [dbo].[Users] ADD  CONSTRAINT [DF_Users_CreatorId]  DEFAULT ((1)) FOR [CreatorId]
GO
ALTER TABLE [dbo].[Projects]  WITH CHECK ADD  CONSTRAINT [FK_Projects_Users] FOREIGN KEY([CreatorId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Projects] CHECK CONSTRAINT [FK_Projects_Users]
GO
ALTER TABLE [dbo].[Projects]  WITH CHECK ADD  CONSTRAINT [FK_Projects_Users1] FOREIGN KEY([LatestChangeUserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Projects] CHECK CONSTRAINT [FK_Projects_Users1]
GO
ALTER TABLE [dbo].[Tasks]  WITH CHECK ADD  CONSTRAINT [FK_Tasks_Projects] FOREIGN KEY([ProjectId])
REFERENCES [dbo].[Projects] ([Id])
GO
ALTER TABLE [dbo].[Tasks] CHECK CONSTRAINT [FK_Tasks_Projects]
GO
ALTER TABLE [dbo].[Tasks]  WITH CHECK ADD  CONSTRAINT [FK_Tasks_Users] FOREIGN KEY([LatestChangeUserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Tasks] CHECK CONSTRAINT [FK_Tasks_Users]
GO
ALTER TABLE [dbo].[Tasks]  WITH CHECK ADD  CONSTRAINT [FK_Tasks_Users1] FOREIGN KEY([CreatorId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Tasks] CHECK CONSTRAINT [FK_Tasks_Users1]
GO
ALTER TABLE [dbo].[Tasks]  WITH CHECK ADD  CONSTRAINT [FK_Tasks_Users2] FOREIGN KEY([AsigneeId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Tasks] CHECK CONSTRAINT [FK_Tasks_Users2]
GO
ALTER TABLE [dbo].[Teams]  WITH CHECK ADD  CONSTRAINT [FK_Teams_Users] FOREIGN KEY([LatestChangeUserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Teams] CHECK CONSTRAINT [FK_Teams_Users]
GO
ALTER TABLE [dbo].[Teams]  WITH CHECK ADD  CONSTRAINT [FK_Teams_Users1] FOREIGN KEY([CreatorId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Teams] CHECK CONSTRAINT [FK_Teams_Users1]
GO
ALTER TABLE [dbo].[TeamsProjects]  WITH CHECK ADD  CONSTRAINT [FK_TeamsProjects_Projects] FOREIGN KEY([ProjectId])
REFERENCES [dbo].[Projects] ([Id])
GO
ALTER TABLE [dbo].[TeamsProjects] CHECK CONSTRAINT [FK_TeamsProjects_Projects]
GO
ALTER TABLE [dbo].[TeamsProjects]  WITH CHECK ADD  CONSTRAINT [FK_TeamsProjects_Teams] FOREIGN KEY([TeamId])
REFERENCES [dbo].[Teams] ([Id])
GO
ALTER TABLE [dbo].[TeamsProjects] CHECK CONSTRAINT [FK_TeamsProjects_Teams]
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD  CONSTRAINT [FK_Users_Users] FOREIGN KEY([CreatorId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Users] CHECK CONSTRAINT [FK_Users_Users]
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD  CONSTRAINT [FK_Users_Users1] FOREIGN KEY([LatestChangeUserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Users] CHECK CONSTRAINT [FK_Users_Users1]
GO
ALTER TABLE [dbo].[UsersTeams]  WITH CHECK ADD  CONSTRAINT [FK_UsersTeams_Teams] FOREIGN KEY([TeamId])
REFERENCES [dbo].[Teams] ([Id])
GO
ALTER TABLE [dbo].[UsersTeams] CHECK CONSTRAINT [FK_UsersTeams_Teams]
GO
ALTER TABLE [dbo].[UsersTeams]  WITH CHECK ADD  CONSTRAINT [FK_UsersTeams_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[UsersTeams] CHECK CONSTRAINT [FK_UsersTeams_Users]
GO
ALTER TABLE [dbo].[Workslogs]  WITH CHECK ADD  CONSTRAINT [FK_Workslogs_Tasks] FOREIGN KEY([TaskId])
REFERENCES [dbo].[Tasks] ([Id])
GO
ALTER TABLE [dbo].[Workslogs] CHECK CONSTRAINT [FK_Workslogs_Tasks]
GO
ALTER TABLE [dbo].[Workslogs]  WITH CHECK ADD  CONSTRAINT [FK_Workslogs_Users] FOREIGN KEY([CreatorId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Workslogs] CHECK CONSTRAINT [FK_Workslogs_Users]
GO
/****** Object:  StoredProcedure [dbo].[CreateUser]    Script Date: 7/7/2021 2:17:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[CreateUser] 
  @Username nvarchar(50)
, @Password nvarchar(50) 
, @FirstName nvarchar(50)
, @LastName nvarchar(50)
, @CreatorId int
, @LatestChangeUserId int
, @IsAdmin bit
AS
BEGIN
INSERT INTO Users
	(Username, [Password],FirstName,LastName,CreatorId,DateOfLastChange,LatestChangeUserId,IsAdmin)
VALUES
	(@Username, @Password, @FirstName, @LastName, @CreatorId, GETDATE(), @LatestChangeUserId, @IsAdmin)
END
GO
USE [master]
GO
ALTER DATABASE [InvictusDB] SET  READ_WRITE 
GO
