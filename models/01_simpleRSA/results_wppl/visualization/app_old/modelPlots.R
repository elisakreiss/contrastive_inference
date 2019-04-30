library(dplyr)
library(ggplot2)
library(bootstrap)
library(lme4)
library(tidyr)

theme_set(theme_bw(18))
setwd("/Users/elisakreiss/Documents/Stanford/overinformativeness/experiments/elisa_paper_relevant/interactiveReferenceGame/results")
source("rscripts/helpers.r")

d = read.table(file="data/bsc_optimalPredictives.csv",sep=",", header=T, quote="")
d = droplevels(d[,c('condition','obj','uttType','modelPrediction')])

typ <- read.table(file="data/meantyp_short.csv",sep=",", header=T,check.names = FALSE)
typ$obj = paste(typ$Color,typ$Item,sep = "_")

d$Typicality = typ$Typicality[match(d$obj, typ$obj)]

production <- d
# plot typical vs atypical by item
# value for typical/atypical separation in mean of all midtypical object ratings
production$binTyp = ifelse(production$Typicality >= 0.784, 'typical', 'atypical')
production$binContext = ifelse(production$condition == "overinformative-cc", 'overinformative', 
                               ifelse(production$condition == "informative-cc", 'informative', as.character(production$condition)))
production$ColorMentioned = ifelse(production$uttType == 'colorOnly' | production$uttType == 'colorType', T, F)
production$Item <- sapply(strsplit(as.character(production$obj),"_"), "[", 2)
production$Color = sapply(strsplit(as.character(production$obj),"_"), "[", 1)

agr = production %>%
  select(condition,ColorMentioned,modelPrediction,binTyp,binContext,Item) %>%
  group_by(binContext,Item,binTyp,ColorMentioned) %>%
  summarise(PropColorMentioned=mean(modelPrediction),ci.low=ci.low(modelPrediction),ci.high=ci.high(modelPrediction))
agr = as.data.frame(agr)
agr$YMin = agr$PropColorMentioned - agr$ci.low
agr$YMax = agr$PropColorMentioned + agr$ci.high

agr$binTyp = factor(agr$binTyp, levels=c("typical","atypical"))

ggplot(agr, aes(x=binTyp,y=PropColorMentioned,color=Item,linetype=binContext,group=interaction(binContext,Item))) +
  geom_point() +
  geom_line() +
  geom_errorbar(aes(ymin=YMin,ymax=YMax),width=.25) +
  xlab("Typicality") +
  ylab("Proportion of  \n mentioning color") +
  theme(axis.title=element_text(size=25,colour="#757575")) +
  theme(axis.text.x=element_text(size=20,colour="#757575")) +
  theme(axis.text.y=element_text(size=20,colour="#757575")) +
  theme(axis.ticks=element_line(size=.25,colour="#757575"), axis.ticks.length=unit(.75,"mm")) +
  theme(legend.title=element_text(size=25,color="#757575")) +
  theme(legend.text=element_text(size=20,colour="#757575")) +
  guides(color=guide_legend(title="Object")) +
  guides(linetype=guide_legend(title="Context"))
ggsave("graphs/model/byitem_variability.png",width=12,height=6)


# plot utterance choice proportions by typicality thick for poster
agr = production %>%
  select(uttType,Typicality,condition,modelPrediction)
  # gather(Utterance,Mentioned,-context,-NormedTypicality) %>%
  # group_by(uttType,condition,Typicality) %>%
  # summarise(Probability=modelPrediction,ci.low=ci.low(modelPrediction),ci.high=ci.high(modelPrediction))
agr = as.data.frame(agr)
agr$uttType <- ifelse(agr$uttType == "typeOnly", "Only Type",
                        ifelse(agr$uttType == "colorOnly", "Only Color",
                               ifelse(agr$uttType == "colorType", "Color + Type","ERROR")))
# agr$YMin = agr$Probability - agr$ci.low
# agr$YMax = agr$Probability + agr$ci.high
# change order of Utterance column
# agr$Utterance <- as.character(agr$Utterance)
# agr$Utterance <- factor(agr$Utterance, levels=c("Type", "Color", "ColorAndType", "Other"))
# change context names to have nicer facet labels 
# levels(agr$context) = c("informative","informative-cc", "overinformative", "overinformative-cc")
# plot
ggplot(agr, aes(x=Typicality,y=modelPrediction,color=uttType)) +
  geom_point(size=2) +
  geom_smooth(method="lm",size=2.25) +
  #geom_errorbar(aes(ymin=YMin,ymax=YMax),width=.25) +
  facet_wrap(~condition) +
  # scale_color_discrete(name="Utterance",
  #     breaks=c("typeOnly", "colorOnly", "colorType"),
  #     labels=c("Only Type", "Only Color", "Color + Type")) +
  xlab("Typicality") +
  ylab("Predicted utterance proportion") +
  coord_cartesian(xlim=c(0.4,1),ylim=c(0, 1)) +
  scale_color_manual(values=c("#56B4E9", "#E69F00", "#9fdf9f")) +
  theme(axis.title=element_text(size=25,colour="#757575")) +
  theme(axis.text.x=element_text(size=20,colour="#757575")) +
  theme(axis.text.y=element_text(size=20,colour="#757575")) +
  theme(axis.ticks=element_line(size=.5,colour="#757575"), axis.ticks.length=unit(1,"mm")) +
  theme(strip.text.x=element_text(size=25,colour="#757575")) +
  theme(legend.position="top") +
  theme(legend.title=element_text(size=25,color="#757575")) +
  theme(legend.text=element_text(size=20,colour="#757575")) +
  labs(color = "Utterance") +
  theme(strip.background=element_rect(colour="#939393",fill="white")) +
  theme(panel.background=element_rect(colour="#939393"))
# ggsave("graphs/model/utterance_by_conttyp.png",width=12,height=7)
ggsave("../../../../../../Uni/BachelorThesis/graphs/modelPredictions.png",width=12,height=7)

# plot utterance choice proportions by typicality for color/non-color
agr = production %>%
  select(ColorMentioned,Type,Other,NormedTypicality,context) %>%
  gather(Utterance,Mentioned,-context,-NormedTypicality) %>%
  group_by(Utterance,context,NormedTypicality) %>%
  summarise(Probability=mean(Mentioned),ci.low=ci.low(Mentioned),ci.high=ci.high(Mentioned))
agr = as.data.frame(agr)
agr$YMin = agr$Probability - agr$ci.low
agr$YMax = agr$Probability + agr$ci.high
# change order of Utterance column
agr$Utterance <- as.character(agr$Utterance)
agr$Utterance <- factor(agr$Utterance, levels=c("ColorMentioned", "Type", "Other"))
# change context names to have nicer facet labels 
levels(agr$context) = c("informative","informative\nwith color competitor", "overinformative", "overinformative\nwith color competitor")
# plot
ggplot(agr, aes(x=NormedTypicality,y=Probability,color=Utterance)) +
  geom_point(size=2) +
  geom_smooth(method="lm",size=2.25) +
  #geom_errorbar(aes(ymin=YMin,ymax=YMax),width=.25) +
  facet_wrap(~context) +
  scale_color_discrete(name="Utterance",
                       breaks=c("ColorMentioned", "Type", "Other"),
                       labels=c("Color Mentioned", "Type Only", "Other")) +
  xlab("Typicality") +
  ylab("Empirical utterance proportion") +
  theme(axis.title=element_text(size=25,colour="#757575")) +
  theme(axis.text.x=element_text(size=20,colour="#757575")) +
  theme(axis.text.y=element_text(size=20,colour="#757575")) +
  theme(axis.ticks=element_line(size=.5,colour="#757575"), axis.ticks.length=unit(1,"mm")) +
  theme(legend.title=element_text(size=25,color="#757575")) +
  theme(legend.text=element_text(size=20,colour="#757575")) +
  theme(strip.background=element_rect(colour="#939393",fill="white")) +
  theme(panel.background=element_rect(colour="#939393"))
ggsave("graphs/empiricalData/utterance_by_conttyp_colorNoncolor.png",width=12,height=9)

#######
#######
#######

# plot utterance choice proportions by typicality
agr = production %>%
  select(Color,Type,ColorAndType,Other,NormedTypicality,context) %>%
  gather(Utterance,Mentioned,-context,-NormedTypicality) %>%
  group_by(Utterance,context,NormedTypicality) %>%
  summarise(Probability=mean(Mentioned),ci.low=ci.low(Mentioned),ci.high=ci.high(Mentioned))
agr = as.data.frame(agr)
agr$YMin = agr$Probability - agr$ci.low
agr$YMax = agr$Probability + agr$ci.high
# change order of Utterance column
agr$Utterance <- as.character(agr$Utterance)
agr$Utterance <- factor(agr$Utterance, levels=c("Type", "Color", "ColorAndType", "Other"))
# change context names to have nicer facet labels 
levels(agr$context) = c("informative","informative\nwith color competitor", "overinformative", "overinformative\nwith color competitor")
# plot
ggplot(agr, aes(x=NormedTypicality,y=Probability,color=Utterance)) +
  geom_point(size=.5) +
  geom_smooth(method="lm",size=.6) +
  #geom_errorbar(aes(ymin=YMin,ymax=YMax),width=.25) +
  facet_wrap(~context) +
  scale_color_discrete(name="Utterance",
                       breaks=c("Type", "Color", "ColorAndType", "Other"),
                       labels=c("Only Type", "Only Color", "Color + Type", "Other")) +
  theme(axis.title=element_text(size=14,colour="#757575")) +
  theme(axis.text.x=element_text(size=10,colour="#757575")) +
  theme(axis.text.y=element_text(size=10,colour="#757575")) +
  theme(axis.ticks=element_line(size=.25,colour="#757575"), axis.ticks.length=unit(.75,"mm")) +
  theme(strip.text.x=element_text(size=12,colour="#757575")) +
  theme(legend.title=element_text(size=14,color="#757575")) +
  theme(legend.text=element_text(size=11,colour="#757575")) +
  theme(strip.background=element_rect(colour="#939393",fill="white")) +
  theme(panel.background=element_rect(colour="#939393"))
ggsave("graphs/empiricalData/utterance_by_conttyp.png",width=12,height=9)
