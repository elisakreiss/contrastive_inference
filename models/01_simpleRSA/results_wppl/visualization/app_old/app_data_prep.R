library(dplyr)
library(ggplot2)
library(bootstrap)
library(lme4)
library(tidyr)

theme_set(theme_bw(18))
setwd("/Users/elisakreiss/Documents/Stanford/overinformativeness/experiments/elisa_paper_relevant/interactiveReferenceGame/results/rscripts/app_bsc")

typ <- read.table(file="data/meantyp_short.csv",sep=",", header=T,check.names = FALSE)
typ$obj = paste(typ$Color,typ$Item,sep = "_")

# df_nonoise <- read.table(file="data/visualizationPredictives.csv",sep=",", header=T,check.names = FALSE)
# df_nonoise$obj = df_nonoise$target

empRef <- read.table(file="data/empiricalReferenceProbs.csv",sep=",", header=T,check.names = FALSE)
empRef$obj <- empRef$target
empRef <- droplevels(empRef[empRef$uttType != 'other',])
empRef <- empRef[,c('uttType','condition','empiricProb','obj')]

# df_bsc1 <- read.table(file="data/bsc_1Predictives.csv",sep=",", header=T,check.names = FALSE)
# df_bsc2 <- read.table(file="data/bsc_2Predictives.csv",sep=",", header=T,check.names = FALSE)
# df_bsc1 <- read.table(file="data/bsc_finer_10Predictives.csv",sep=",", header=T,check.names = FALSE)
# df_bsc2 <- read.table(file="data/bsc_finer_11Predictives.csv",sep=",", header=T,check.names = FALSE)
df_bsc1 <- read.table(file="data/bsc_finer_20Predictives.csv",sep=",", header=T,check.names = FALSE)
df_bsc2 <- read.table(file="data/bsc_finer_21Predictives.csv",sep=",", header=T,check.names = FALSE)

df_bsc <- rbind(df_bsc1,df_bsc2)

df_bsc <- df_bsc[,c('condition','obj', 'alpha','typeCost','lengthWeight','typWeight','uttType','modelPrediction')]

df <- left_join(df_bsc,empRef)
df$Typicality = typ$Typicality[match(df$obj, typ$obj)]

df <- df[,c('condition','alpha','typeCost','lengthWeight','typWeight','uttType','modelPrediction','empiricProb','Typicality')]

df_overinf <- droplevels(df[df$condition=='overinformative' | df$condition=='overinformative-cc',])
df_inf <- droplevels(df[df$condition=='informative' | df$condition=='informative-cc',])

# write.csv(df, "data/completeDataPredictives_nopink.csv", row.names = FALSE)
write.csv(df, "data/completeDataPredictives_20.csv", row.names = FALSE)
write.csv(df_overinf, "data/completeDataPredictives_20_overinf.csv", row.names = FALSE)
write.csv(df_inf, "data/completeDataPredictives_20_inf.csv", row.names = FALSE)

################
################
df_bsc0 <- read.table(file="data/bsc_finer_6Predictives.csv",sep=",", header=T,check.names = FALSE)
df_bsc1 <- read.table(file="data/bsc_finer_8Predictives.csv",sep=",", header=T,check.names = FALSE)
df_bsc2 <- read.table(file="data/bsc_finer_10Predictives.csv",sep=",", header=T,check.names = FALSE)
df_bsc3 <- read.table(file="data/bsc_finer_11Predictives.csv",sep=",", header=T,check.names = FALSE)
df_bsc4 <- read.table(file="data/bsc_finer_12Predictives.csv",sep=",", header=T,check.names = FALSE)
df_bsc5 <- read.table(file="data/bsc_finer_15Predictives.csv",sep=",", header=T,check.names = FALSE)
df_bsc6 <- read.table(file="data/bsc_finer_16Predictives.csv",sep=",", header=T,check.names = FALSE)
df_bsc7 <- read.table(file="data/bsc_finer_20Predictives.csv",sep=",", header=T,check.names = FALSE)
df_bsc8 <- read.table(file="data/bsc_finer_21Predictives.csv",sep=",", header=T,check.names = FALSE)
df_bsc9 <- read.table(file="data/bsc_finer_22Predictives.csv",sep=",", header=T,check.names = FALSE)
df_bsc10 <- read.table(file="data/bsc_finer_25Predictives.csv",sep=",", header=T,check.names = FALSE)
df_bscF <- read.table(file="data/bsc_finalPredictives.csv",sep=",", header=T,check.names = FALSE)

df_bsc <- rbind(df_bsc0,df_bsc1,df_bsc2,df_bsc3,df_bsc4,df_bsc5,df_bsc6,df_bsc7,df_bsc8,df_bsc9,df_bsc10,df_bscF)

df_bsc <- df_bsc[,c('condition','obj', 'alpha','typeCost','lengthWeight','typWeight','uttType','modelPrediction')]

df <- left_join(df_bsc,empRef)
df$Typicality = typ$Typicality[match(df$obj, typ$obj)]

df <- df[,c('condition','alpha','typeCost','lengthWeight','typWeight','uttType','modelPrediction','empiricProb','Typicality')]

df_overinf <- droplevels(df[df$condition=='overinformative' | df$condition=='overinformative-cc',])
df_inf <- droplevels(df[df$condition=='informative' | df$condition=='informative-cc',])

write.csv(df, "data/completeDataPredictives_fine.csv", row.names = FALSE)
write.csv(df_overinf, "data/completeDataPredictives_fine_overinf.csv", row.names = FALSE)
write.csv(df_inf, "data/completeDataPredictives_fine_inf.csv", row.names = FALSE)

################
################

df_bsc0 <- read.table(file="data/bsc_finalPredictives.csv",sep=",", header=T,check.names = FALSE)
df_bsc1 <- read.table(file="data/bsc_final2Predictives.csv",sep=",", header=T,check.names = FALSE)

df_bsc <- rbind(df_bsc0,df_bsc1)

df_bsc <- df_bsc[,c('condition','obj', 'alpha','typeCost','lengthWeight','typWeight','uttType','modelPrediction')]

df <- left_join(df_bsc,empRef)
df$Typicality = typ$Typicality[match(df$obj, typ$obj)]

df <- df[,c('condition','alpha','typeCost','lengthWeight','typWeight','uttType','modelPrediction','empiricProb','Typicality')]

df_overinf <- droplevels(df[df$condition=='overinformative' | df$condition=='overinformative-cc',])
df_inf <- droplevels(df[df$condition=='informative' | df$condition=='informative-cc',])

write.csv(df, "data/finalPredictives.csv", row.names = FALSE)
write.csv(df_overinf, "data/finalPredictives_overinf.csv", row.names = FALSE)
write.csv(df_inf, "data/finalPredictives_inf.csv", row.names = FALSE)

