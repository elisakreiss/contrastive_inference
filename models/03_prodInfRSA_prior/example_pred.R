library(tidyverse)
library(here)
library(cowplot)

# theme_set(theme_bw())

nocontrast = tibble(item = c("1_target", "1_target", "2_comp", "2_comp"),
                    measure = c("prod", "prod_normalized", "prod", "prod_normalized"),
                    value = c(0.1, 0.5, 0.1, 0.5))

nocontrast %>% 
  filter(measure == "prod_normalized") %>% 
ggplot(., aes(x=item, y=value, fill=measure)) +
  geom_bar(stat = "identity", position = position_dodge(), width = 0.8) +
  theme(legend.position = "none") +
  theme(axis.title.x = element_blank()) +
  theme(axis.text.x = element_blank()) +
  theme(axis.ticks.x = element_blank()) +
  scale_fill_manual(values=c("darkgrey")) +
  ylim(0,1) +
  ylab("Predicted proportion\nof preference") +
  theme(panel.grid.minor = element_blank(), 
        panel.grid.major = element_line("grey", size = 0.1))

ggsave(here("writing", "2020_CogSci", "paper", "graphs", "prod_nocontrast.pdf"), width = 4, height = 2)

contrast_typ = tibble(item = c("1_target", "1_target", "2_comp", "2_comp"),
                    measure = c("prod", "prod_normalized", "prod", "prod_normalized"),
                    value = c(0.9, 0.9, 0.1, 0.1))

contrast_typ %>% 
  filter(measure == "prod_normalized") %>% 
  ggplot(., aes(x=item, y=value, fill=measure)) +
  geom_bar(stat = "identity", position = position_dodge(), width = 0.8) +
  theme(legend.position = "none") +
  theme(axis.title.x = element_blank()) +
  theme(axis.text.x = element_blank()) +
  theme(axis.ticks.x = element_blank()) +
  scale_fill_manual(values=c("darkgrey")) +
  ylim(0,1) +
  ylab("Predicted proportion\nof preference") +
  theme(panel.grid.minor = element_blank(), 
       panel.grid.major = element_line("grey", size = 0.1))

ggsave(here("writing", "2020_CogSci", "paper", "graphs", "prod_contrasttyp.pdf"), width = 4, height = 2)


contrast_atyp = tibble(item = c("1_target", "1_target", "2_comp", "2_comp"),
                      measure = c("prod", "prod_normalized", "prod", "prod_normalized"),
                      value = c(0.90, 0.6, 0.6, 0.4))

contrast_atyp %>% 
  filter(measure == "prod_normalized") %>% 
  ggplot(., aes(x=item, y=value, fill=measure)) +
  geom_bar(stat = "identity", position = position_dodge(), width = 0.8) +
  theme(legend.position = "none") +
  theme(axis.title.x = element_blank()) +
  theme(axis.text.x = element_blank()) +
  theme(axis.ticks.x = element_blank()) +
  scale_fill_manual(values=c("darkgrey")) +
  ylim(0,1) +
  ylab("Predicted proportion\nof preference") +
  theme(panel.grid.minor = element_blank(), 
        panel.grid.major = element_line("grey", size = 0.1))

ggsave(here("writing", "2020_CogSci", "paper", "graphs", "prod_contrastatyp.pdf"), width = 4, height = 2)
