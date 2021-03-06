USE [master]
GO
/****** Object:  Database [InvictusDB]    Script Date: 15.7.2021 г. 3:49:46 ******/
CREATE DATABASE [InvictusDB]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'InvictusDB', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.SQLEXPRESS\MSSQL\DATA\InvictusDB.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'InvictusDB_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.SQLEXPRESS\MSSQL\DATA\InvictusDB_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO
ALTER DATABASE [InvictusDB] SET COMPATIBILITY_LEVEL = 150
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
ALTER DATABASE [InvictusDB] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [InvictusDB] SET QUERY_STORE = OFF
GO
USE [InvictusDB]
GO
/****** Object:  Table [dbo].[Projects]    Script Date: 15.7.2021 г. 3:49:46 ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Tasks]    Script Date: 15.7.2021 г. 3:49:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Tasks](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ProjectId] [int] NULL,
	[AsigneeId] [int] NOT NULL,
	[Title] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](250) NOT NULL,
	[Status] [tinyint] NOT NULL,
	[DateOfCreation] [datetime] NOT NULL,
	[CreatorId] [int] NOT NULL,
	[DateOfLastChange] [datetime] NOT NULL,
	[LatestChangeUserId] [int] NOT NULL,
 CONSTRAINT [PK_Tasks] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Teams]    Script Date: 15.7.2021 г. 3:49:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Teams](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Title] [nvarchar](50) NOT NULL,
	[DateOfCreation] [datetime] NOT NULL,
	[CreatorId] [int] NOT NULL,
	[DateOfLastChange] [datetime] NOT NULL,
	[LatestChangeUserId] [int] NOT NULL,
 CONSTRAINT [PK_Team] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TeamsProjects]    Script Date: 15.7.2021 г. 3:49:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TeamsProjects](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[TeamId] [int] NOT NULL,
	[ProjectId] [int] NULL,
 CONSTRAINT [PK_TeamsProjects] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 15.7.2021 г. 3:49:46 ******/
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
	[DateOfCreation] [datetime] NOT NULL,
	[CreatorId] [int] NULL,
	[DateOfLastChange] [datetime] NOT NULL,
	[LatestChangeUserId] [int] NULL,
	[IsAdmin] [bit] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UsersTeams]    Script Date: 15.7.2021 г. 3:49:46 ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Worklogs]    Script Date: 15.7.2021 г. 3:49:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Worklogs](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[TaskId] [int] NOT NULL,
	[Time] [smallint] NOT NULL,
	[CreatorId] [int] NOT NULL,
	[Date] [datetime] NOT NULL,
 CONSTRAINT [PK_Workslogs] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Projects] ON 

INSERT [dbo].[Projects] ([Id], [Title], [Description], [DateOfCreation], [CreatorId], [DateOfLastChange], [LatestChangeUserId]) VALUES (59, N'PMS', N'Project management system, a project designed specifically for the scalefocus internship.', CAST(N'2021-07-15T03:06:29.590' AS DateTime), 23, CAST(N'2021-07-15T03:06:57.267' AS DateTime), 23)
INSERT [dbo].[Projects] ([Id], [Title], [Description], [DateOfCreation], [CreatorId], [DateOfLastChange], [LatestChangeUserId]) VALUES (61, N'Add', N'Add', CAST(N'2021-07-15T03:37:38.610' AS DateTime), 19, CAST(N'2021-07-15T03:37:38.610' AS DateTime), 19)
SET IDENTITY_INSERT [dbo].[Projects] OFF
GO
SET IDENTITY_INSERT [dbo].[Tasks] ON 

INSERT [dbo].[Tasks] ([Id], [ProjectId], [AsigneeId], [Title], [Description], [Status], [DateOfCreation], [CreatorId], [DateOfLastChange], [LatestChangeUserId]) VALUES (15, 59, 20, N'Add file structure', N'implement html, css and js file structure', 1, CAST(N'2021-07-15T03:14:53.320' AS DateTime), 23, CAST(N'2021-07-15T03:15:21.177' AS DateTime), 23)
INSERT [dbo].[Tasks] ([Id], [ProjectId], [AsigneeId], [Title], [Description], [Status], [DateOfCreation], [CreatorId], [DateOfLastChange], [LatestChangeUserId]) VALUES (16, 59, 19, N'Implement Front-end', N'Create web platform template', 1, CAST(N'2021-07-15T03:16:22.400' AS DateTime), 23, CAST(N'2021-07-15T03:30:03.920' AS DateTime), 23)
INSERT [dbo].[Tasks] ([Id], [ProjectId], [AsigneeId], [Title], [Description], [Status], [DateOfCreation], [CreatorId], [DateOfLastChange], [LatestChangeUserId]) VALUES (17, 59, 21, N'Add README.md', N'Should be simple enough', 1, CAST(N'2021-07-15T03:29:37.253' AS DateTime), 23, CAST(N'2021-07-15T03:29:37.253' AS DateTime), 23)
INSERT [dbo].[Tasks] ([Id], [ProjectId], [AsigneeId], [Title], [Description], [Status], [DateOfCreation], [CreatorId], [DateOfLastChange], [LatestChangeUserId]) VALUES (18, 59, 19, N'Fix Bugs', N'Example Desc', 1, CAST(N'2021-07-15T03:32:21.280' AS DateTime), 19, CAST(N'2021-07-15T03:32:21.280' AS DateTime), 19)
SET IDENTITY_INSERT [dbo].[Tasks] OFF
GO
SET IDENTITY_INSERT [dbo].[Teams] ON 

INSERT [dbo].[Teams] ([Id], [Title], [DateOfCreation], [CreatorId], [DateOfLastChange], [LatestChangeUserId]) VALUES (32, N'Scalefocus Internship', CAST(N'2021-07-15T03:05:21.170' AS DateTime), 23, CAST(N'2021-07-15T03:05:21.170' AS DateTime), 23)
SET IDENTITY_INSERT [dbo].[Teams] OFF
GO
SET IDENTITY_INSERT [dbo].[TeamsProjects] ON 

INSERT [dbo].[TeamsProjects] ([Id], [TeamId], [ProjectId]) VALUES (33, 32, 59)
SET IDENTITY_INSERT [dbo].[TeamsProjects] OFF
GO
SET IDENTITY_INSERT [dbo].[Users] ON 

INSERT [dbo].[Users] ([Id], [Username], [Password], [FirstName], [LastName], [DateOfCreation], [CreatorId], [DateOfLastChange], [LatestChangeUserId], [IsAdmin], [IsDeleted]) VALUES (1, N'DEL', N'WOERJGNWEIGNWOIGNWOE', N'DELETED', N'USER', CAST(N'2001-01-01T01:01:01.000' AS DateTime), 2, CAST(N'2001-01-01T01:01:01.000' AS DateTime), 2, 0, 1)
INSERT [dbo].[Users] ([Id], [Username], [Password], [FirstName], [LastName], [DateOfCreation], [CreatorId], [DateOfLastChange], [LatestChangeUserId], [IsAdmin], [IsDeleted]) VALUES (2, N'admin', N'adminpass', N'Main', N'Admin', CAST(N'2001-01-01T01:01:01.000' AS DateTime), 2, CAST(N'2021-07-15T02:53:30.317' AS DateTime), 2, 1, 0)
INSERT [dbo].[Users] ([Id], [Username], [Password], [FirstName], [LastName], [DateOfCreation], [CreatorId], [DateOfLastChange], [LatestChangeUserId], [IsAdmin], [IsDeleted]) VALUES (19, N'kamilanov18', N'kam', N'Kristian', N'Milanov', CAST(N'2021-07-15T02:54:05.743' AS DateTime), 2, CAST(N'2021-07-15T02:54:05.743' AS DateTime), 2, 0, 0)
INSERT [dbo].[Users] ([Id], [Username], [Password], [FirstName], [LastName], [DateOfCreation], [CreatorId], [DateOfLastChange], [LatestChangeUserId], [IsAdmin], [IsDeleted]) VALUES (20, N'IIDimov18', N'iid', N'Ivan', N'Dimov', CAST(N'2021-07-15T02:54:28.607' AS DateTime), 2, CAST(N'2021-07-15T02:54:28.607' AS DateTime), 2, 0, 0)
INSERT [dbo].[Users] ([Id], [Username], [Password], [FirstName], [LastName], [DateOfCreation], [CreatorId], [DateOfLastChange], [LatestChangeUserId], [IsAdmin], [IsDeleted]) VALUES (21, N'aihristov18', N'aih', N'Aleksandar', N'Hristov', CAST(N'2021-07-15T02:55:23.873' AS DateTime), 2, CAST(N'2021-07-15T02:58:06.060' AS DateTime), 2, 0, 0)
INSERT [dbo].[Users] ([Id], [Username], [Password], [FirstName], [LastName], [DateOfCreation], [CreatorId], [DateOfLastChange], [LatestChangeUserId], [IsAdmin], [IsDeleted]) VALUES (22, N'EIRibarev18', N'eir', N'Emil', N'Ribarev', CAST(N'2021-07-15T02:56:01.820' AS DateTime), 2, CAST(N'2021-07-15T02:56:01.820' AS DateTime), 2, 0, 0)
INSERT [dbo].[Users] ([Id], [Username], [Password], [FirstName], [LastName], [DateOfCreation], [CreatorId], [DateOfLastChange], [LatestChangeUserId], [IsAdmin], [IsDeleted]) VALUES (23, N'agyuzelov', N'agyz', N'Aleksandar', N'Gyuzelov', CAST(N'2021-07-15T02:57:47.133' AS DateTime), 2, CAST(N'2021-07-15T02:57:47.133' AS DateTime), 2, 1, 0)
SET IDENTITY_INSERT [dbo].[Users] OFF
GO
SET IDENTITY_INSERT [dbo].[UsersTeams] ON 

INSERT [dbo].[UsersTeams] ([Id], [UserId], [TeamId]) VALUES (34, 19, 32)
INSERT [dbo].[UsersTeams] ([Id], [UserId], [TeamId]) VALUES (35, 20, 32)
INSERT [dbo].[UsersTeams] ([Id], [UserId], [TeamId]) VALUES (36, 21, 32)
INSERT [dbo].[UsersTeams] ([Id], [UserId], [TeamId]) VALUES (37, 22, 32)
SET IDENTITY_INSERT [dbo].[UsersTeams] OFF
GO
SET IDENTITY_INSERT [dbo].[Worklogs] ON 

INSERT [dbo].[Worklogs] ([Id], [TaskId], [Time], [CreatorId], [Date]) VALUES (13, 18, 1115, 19, CAST(N'2021-07-15T03:33:00.183' AS DateTime))
SET IDENTITY_INSERT [dbo].[Worklogs] OFF
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
ALTER TABLE [dbo].[Worklogs]  WITH CHECK ADD  CONSTRAINT [FK_Workslogs_Tasks] FOREIGN KEY([TaskId])
REFERENCES [dbo].[Tasks] ([Id])
GO
ALTER TABLE [dbo].[Worklogs] CHECK CONSTRAINT [FK_Workslogs_Tasks]
GO
ALTER TABLE [dbo].[Worklogs]  WITH CHECK ADD  CONSTRAINT [FK_Workslogs_Users] FOREIGN KEY([CreatorId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Worklogs] CHECK CONSTRAINT [FK_Workslogs_Users]
GO
ALTER TABLE [dbo].[Tasks]  WITH CHECK ADD  CONSTRAINT [CK_Tasks_Status] CHECK  (([Status]>=(1) AND [Status]<=(3)))
GO
ALTER TABLE [dbo].[Tasks] CHECK CONSTRAINT [CK_Tasks_Status]
GO
/****** Object:  StoredProcedure [dbo].[CreateProject]    Script Date: 15.7.2021 г. 3:49:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[CreateProject]
  @Title nvarchar(50)
, @Description nvarchar(250)
, @CreatorId Int
AS
BEGIN
INSERT INTO Projects
	(Title,[Description],DateOfCreation,CreatorId,DateOfLastChange,LatestChangeUserId)
VALUES
	(@Title,@Description,GETDATE(),@CreatorId,GETDATE(),@CreatorId)
END
GO
/****** Object:  StoredProcedure [dbo].[CreateTask]    Script Date: 15.7.2021 г. 3:49:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[CreateTask]
  @ProjectId int
, @AsigneeId int
, @Title nvarchar(50)
, @Description nvarchar(250)
, @Status tinyint
, @CreatorId int
AS
BEGIN
INSERT INTO Tasks
	(ProjectId,AsigneeId,Title,[Description],[Status],DateOfCreation,CreatorId,DateOfLastChange,LatestChangeUserId)
VALUES
	(@ProjectId,@AsigneeId,@Title,@Description,@Status,GETDATE(),@CreatorId,GETDATE(),@CreatorId)
END
GO
/****** Object:  StoredProcedure [dbo].[CreateTeam]    Script Date: 15.7.2021 г. 3:49:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[CreateTeam]
  @Title nvarchar(50)
, @CreatorId Int
AS
BEGIN
INSERT INTO Teams
	(Title,DateOfCreation,CreatorId,DateOfLastChange,LatestChangeUserId)
VALUES
	(@Title,GETDATE(),@CreatorId,GETDATE(),@CreatorId)
END
GO
/****** Object:  StoredProcedure [dbo].[CreateUser]    Script Date: 15.7.2021 г. 3:49:46 ******/
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
, @IsAdmin bit
AS
BEGIN
INSERT INTO Users
	(Username, [Password],FirstName,LastName,CreatorId,DateOfLastChange,LatestChangeUserId,IsAdmin,isDeleted)
VALUES
	(@Username, @Password, @FirstName, @LastName, @CreatorId, GETDATE(), @CreatorId, @IsAdmin, 0)
END
GO
/****** Object:  StoredProcedure [dbo].[CreateWorklog]    Script Date: 15.7.2021 г. 3:49:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[CreateWorklog]
  @TaskId int
, @Time smallint
, @CreatorId int
AS
BEGIN
INSERT INTO Worklogs
	(TaskId,[Time],CreatorId,[Date])
VALUES
	(@TaskId,@Time,@CreatorId,GETDATE())
END
GO
/****** Object:  StoredProcedure [dbo].[DeleteTask]    Script Date: 15.7.2021 г. 3:49:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[DeleteTask]
@TaskId int
AS
BEGIN

DELETE FROM Worklogs
WHERE TaskId = @TaskId

DELETE FROM Tasks
WHERE Id = @TaskId

END
GO
/****** Object:  StoredProcedure [dbo].[DeleteTeam]    Script Date: 15.7.2021 г. 3:49:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[DeleteTeam]
@TeamId int
AS
BEGIN
DELETE FROM UsersTeams
WHERE TeamId = @TeamId
DELETE FROM TeamsProjects
WHERE TeamId = @TeamId
DELETE FROM Teams
WHERE Id = @TeamId

END
GO
/****** Object:  StoredProcedure [dbo].[DeleteUser]    Script Date: 15.7.2021 г. 3:49:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[DeleteUser]
@UserId int
AS
BEGIN
UPDATE Projects
SET CreatorId = 1
WHERE CreatorId=@UserId
UPDATE Projects
SET LatestChangeUserId = 1
WHERE LatestChangeUserId=@UserId
UPDATE Tasks
SET LatestChangeUserId = 1
WHERE LatestChangeUserId=@UserId
UPDATE Tasks
SET CreatorId = 1
WHERE CreatorId=@UserId
UPDATE Teams
SET LatestChangeUserId = 1
WHERE LatestChangeUserId=@UserId
UPDATE Teams
SET CreatorId = 1
WHERE CreatorId=@UserId
UPDATE Worklogs
SET CreatorId = 1
WHERE CreatorId=@UserId
DELETE FROM UsersTeams
WHERE UserId = @UserId
DELETE FROM Users
WHERE Id = @UserId
END
GO
USE [master]
GO
ALTER DATABASE [InvictusDB] SET  READ_WRITE 
GO
