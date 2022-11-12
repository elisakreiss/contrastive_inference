require(ggplot2); require(grid); require(png); require(RCurl)
library(tidyverse)
library(ggimage)

df_blub = read_csv("vis_data/emp_noprevsel_noprior.csv",col_names = TRUE) %>% 
  select(condition, obj_in_display_diff, clicked) %>%
  mutate(prior = "no prior") %>% 
  mutate(data_type = "empirical") %>% 
  mutate(sel = "Empirical: No prior")

img1 = readPNG(getURLContent('https://cdn2.iconfinder.com/data/icons/animals/48/Turtle.png'))
img2 = readPNG(getURLContent('https://cdn2.iconfinder.com/data/icons/animals/48/Elephant.png'))
img3 = readPNG(getURLContent('https://cdn2.iconfinder.com/data/icons/animals/48/Hippopotamus.png'))

anno = data.frame(condition = c("tap", "tan"),
                  obj_in_display_diff = c("target", "target"),
                  xmin = c(2.5, 2.5), 
                  xmax = c(4.5, 4.5),
                  clicked = c(0.7, 0.7), 
                  xmax = c(1.0, 1.0),
                  image = c("https://cdn2.iconfinder.com/data/icons/animals/48/Turtle.png", "https://cdn2.iconfinder.com/data/icons/animals/48/Elephant.png"))

# annotation_custom2 <- 
#   function (grob1, grob2, xmin = -Inf, xmax = Inf, ymin = 0.5, ymax = 0.7, data_filter) { 
#     layer(data = filter(df_blub, condition == data_filter), 
#           stat = StatIdentity, 
#           position = PositionIdentity, 
#           geom = ggplot2:::GeomCustomAnn,
#           inherit.aes = TRUE, 
#           params = list(grob = grob1, 
#                         xmin = xmin, 
#                         xmax = xmax, 
#                         ymin = ymin, 
#                         ymax = ymax))}
# 
# a1 = annotation_custom2(rasterGrob(img1, interpolate=TRUE),  
#                         data_filter="tan")
# a2 = annotation_custom2(rasterGrob(img2, interpolate=TRUE),  
#                         data_filter="tap")
# # a3 = annotation_custom2(rasterGrob(img3, interpolate=TRUE), 
# #                         xmin=7, xmax=8, 
# #                         ymin=3.75, ymax=4.5, 
# #                         data=iris[101,])

df_filter = df_blub %>% 
  bind_rows(df_blub) %>% 
  filter(condition != "aan")
  # mutate(image="https://www.r-project.org/logo/Rlogo.png")

# df_simple = df_blub %>% 
#   select(condition, obj_in_display_diff, clicked) %>% 
#   distinct()

ggplot(df_filter, aes(x=obj_in_display_diff, 
                          y=clicked)) +
  facet_wrap(~condition, scales = "free_x", ncol=4) +
  stat_summary(fun = "mean",
               geom = "bar",
               width = 0.8,
               position = position_dodge(width = 0.8)) +
  stat_summary(fun.data = "mean_cl_normal",
               geom = "errorbar",
               color = "black",
               position = position_dodge(width = 0.8),
               size = .5,
               width = 0.2) +
  theme(legend.position = "none") +
  theme(strip.background = element_rect(color="black", 
                                        fill="white", 
                                        size=1.5,
                                        linetype="solid"),
        strip.text.x = element_text(margin = margin(3,0,3,0, "pt"))
  ) +
  scale_alpha_manual(values=c(1, 0.5)) +
  scale_x_discrete(labels=c("comp"="competitor")) +
  theme(axis.text.x = element_text(angle = 30, hjust = 1)) +
  ylim(0,1) +
  xlab("Item") +
  ylab("Proportion of (predicted) selections") +
  theme(text = element_text(size=20)) +
  geom_image(data=anno, aes(image=image))
  # layer(
  #       data = anno,
  #       inherit.aes = FALSE,
  #       stat = StatIdentity,
  #       position = PositionIdentity,
  #       geom = ggplot2:::GeomCustomAnn,
  #       params = list(grob = rasterGrob(img1), 
  #                      xmin = 2.5, 
  #                      xmax = 4.5, 
  #                      ymin = 0.8, 
  #                      ymax = 1))

p

# p = ggplot(iris, aes(Sepal.Length, Sepal.Width)) + geom_point() + facet_wrap(~Species)


p + a1 + a2
 